import * as Etebase from "etebase";
import * as Protobuf from "./protobuf/page.ts";

const COLLECTION_TYPE = "etepedia.directory";

class EBBackedItem {
  item: Etebase.Item | undefined;
  meta: Etebase.ItemMetadata = {};
  populated: Boolean = false;
  content: {} = {};

  constructor(i?: Etebase.Item) {
    if (i) {
      this.item = i;
      this.meta = i.getMeta();
    }
  }

  async populate() {}
}

export class Page extends EBBackedItem {
  content: Protobuf.Page;

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
  content: Protobuf.Group;

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
  pages: Page[] = [];
  groups: Group[] = [];

  collectionManager: Etebase.CollectionManager;
  collection: Etebase.Collection;
  itemManager: Etebase.ItemManager;
  collectionInfo: Protobuf.CollectionInfo;

  static async Create(etebase: Etebase.Account): Promise<Directory> {
    const me = new Directory();

    me.collectionManager = etebase.getCollectionManager();

    let collections = await me.collectionManager.list(COLLECTION_TYPE);

    if (collections.data.length == 0) {
      me.collectionInfo = { pages: [], groups: [] };
      me.collection = await me.collectionManager.create(
        COLLECTION_TYPE,
        {
          name: "etepedia0",
          description: "etepedia directory 0",
          color: "#aa0000",
        },
        Protobuf.CollectionInfo.encode(me.collectionInfo).finish()
      );
      await me.collectionManager.upload(me.collection);
      me.itemManager = me.collectionManager.getItemManager(me.collection);
    } else {
      me.collection = collections.data[0];
      me.itemManager = me.collectionManager.getItemManager(me.collection);
      await me.update();
    }
    return me;
  }

  async update() {
    const stoken = this.collection.stoken;
    this.collection = await this.collectionManager.fetch(this.collection.uid, {
      stoken,
    });
    this.collectionInfo = Protobuf.CollectionInfo.decode(
      await this.collection.getContent(Etebase.OutputFormat.Uint8Array)
    );
  }

  async populate() {
    if (this.collectionInfo.pages.length > 0) {
      this.pages = (
        await this.itemManager.fetchMulti(this.collectionInfo.pages)
      ).data.map((it) => new Page(it));
    }
    if (this.collectionInfo.groups.length > 0) {
      this.groups = (
        await this.itemManager.fetchMulti(this.collectionInfo.groups)
      ).data.map((it) => new Group(it));
    }
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
      this.pages.push(page);
    }
    if (page.content.groups && page.content.groups.length != 0) {
      // TODO
    }
    await this.collection.setContent(
      Protobuf.CollectionInfo.encode(this.collectionInfo).finish()
    );
    return await this.itemManager.batch([page.item, this.collection.item]);
  }
}
