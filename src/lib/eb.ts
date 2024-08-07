import * as Etebase from "etebase";
import * as Protobuf from "./protobuf/page";

const COLLECTION_TYPE = "etepedia.directory";

export type PageID = EBItemID;
export type DirectoryID = EBItemID;
export type EBItemID = string;

class EBBackedItem {
  item: Etebase.Item | undefined;
  meta: Etebase.ItemMetadata = {};
  populated: boolean = false;
  content: {} | null = null;

  constructor(i?: Etebase.Item) {
    if (i) {
      this.item = i;
      this.meta = i.getMeta();
    }
  }

  async populate() {}
}

export class Page extends EBBackedItem {
  content: Protobuf.Page | null = null;

  constructor(i?: Etebase.Item) {
    super(i);
    this.content = Protobuf.Page.create();
  }

  async populate() {
    if (this.item) {
      this.content = Protobuf.Page.decode(
        await this.item.getContent(Etebase.OutputFormat.Uint8Array)
      );
      this.populated = true;
    }
  }
}

export class Group extends EBBackedItem {
  content: Protobuf.Group | null = null;

  constructor(i?: Etebase.Item) {
    super(i);
    this.content = Protobuf.Group.create();
  }

  async populate() {
    if (this.item) {
      this.content = Protobuf.Group.decode(
        await this.item.getContent(Etebase.OutputFormat.Uint8Array)
      );
      this.populated = true;
    }
  }
}

export class Directory {
  pages: Map<PageID, Page> = new Map();
  populated: boolean = false;

  collection: Etebase.Collection;
  collectionInfo: Protobuf.CollectionInfo;
  meta: Etebase.ItemMetadata;

  collectionManager: Etebase.CollectionManager;
  itemManager: Etebase.ItemManager;

  static async Create(
    collectionManager: Etebase.CollectionManager,
    meta: Etebase.ItemMetadata
  ): Promise<Directory> {
    const me = new Directory();

    me.collectionManager = collectionManager;
    me.collectionInfo = { pages: [], groups: [] };
    me.collection = await me.collectionManager.create(
      COLLECTION_TYPE,
      meta,
      Protobuf.CollectionInfo.encode(me.collectionInfo).finish()
    );
    await me.collectionManager.upload(me.collection);
    me.itemManager = me.collectionManager.getItemManager(me.collection);
    me.meta = me.collection.getMeta();

    return me;
  }

  static async LoadFromServer(
    collectionManager: Etebase.CollectionManager,
    collection: Etebase.Collection
  ): Promise<Directory> {
    const me = new Directory();
    me.collectionManager = collectionManager;
    me.collection = collection;
    me.itemManager = collectionManager.getItemManager(collection);
    await me.update();
    return me;
  }

  /** fetch updates to collection and this.collectionInfo */
  async update() {
    const stoken = this.collection.stoken;
    this.collection = await this.collectionManager.fetch(this.collection.uid, {
      stoken,
    });
    this.meta = this.collection.getMeta();
    this.collectionInfo = Protobuf.CollectionInfo.decode(
      await this.collection.getContent(Etebase.OutputFormat.Uint8Array)
    );
  }

  /** fill this.pages with Page */
  async populate() {
    if (this.collectionInfo.pages.length > 0) {
      (
        await this.itemManager.fetchMulti(this.collectionInfo.pages)
      ).data.forEach((it) => this.pages.set(it.uid, new Page(it)));
    }
    this.populated = true;
  }

  /**
   * add a new page, or update it
   *
   * it adds or upload page.item, along with related directory props */
  async uploadPage(page: Page) {
    let metadata = {
      ...{
        type: "page",
        mtime: new Date().getTime(),
      },
      ...page.meta,
    };
    let content = Protobuf.Page.encode(page.content).finish();

    if (page.item) {
      // it has an item => I'm assuming it's already in the directory
      page.meta.mtime = metadata.mtime;
      page.item.setMeta(metadata);
      page.item.setContent(content);
    } else {
      page.item = await this.itemManager.create(metadata, content);
      this.collectionInfo.pages.push(page.item.uid);
      this.pages[page.item.uid] = page;
    }
    await this.collection.setContent(
      Protobuf.CollectionInfo.encode(this.collectionInfo).finish()
    );
    return await this.itemManager.batch([page.item, this.collection.item]);
  }
}

export async function listDirectories(
  etebase: Etebase.Account
): Promise<Map<DirectoryID, Directory>> {
  let collectionManager = etebase.getCollectionManager();
  let collections = await collectionManager.list(COLLECTION_TYPE);

  type DirByUid = [DirectoryID, Directory];

  let directories = await Promise.all(
    collections.data.map(
      async (collection) =>
        [
          collection.uid,
          await Directory.LoadFromServer(collectionManager, collection),
        ] as DirByUid
    )
  );

  return new Map(directories);
}

/** "what directory does this page belong to?" */
export function indexPages(dirs: Directory[]): Map<PageID, Directory> {
  type PageRef = [PageID, Directory]; // for some reason without the cast it is interpreted as (string | Directory) rather than a tuple
  return new Map(
    dirs.flatMap((dir) =>
      dir.collectionInfo.pages.map((pageID) => [pageID, dir] as PageRef)
    )
  );
}
