// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.1
//   protoc               v5.27.2
// source: protobuf/page.proto

/* eslint-disable */
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface CollectionInfo {
  /** list of all page ids */
  pages: string[];
  /** list of all group ids */
  groups: string[];
}

export interface Page {
  text?: string | undefined;
}

export interface Group {
  pageId: string;
  /** ids of member pages */
  members: string[];
}

function createBaseCollectionInfo(): CollectionInfo {
  return { pages: [], groups: [] };
}

export const CollectionInfo = {
  encode(message: CollectionInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.pages) {
      writer.uint32(10).string(v!);
    }
    for (const v of message.groups) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CollectionInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectionInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pages.push(reader.string());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groups.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CollectionInfo {
    return {
      pages: globalThis.Array.isArray(object?.pages) ? object.pages.map((e: any) => globalThis.String(e)) : [],
      groups: globalThis.Array.isArray(object?.groups) ? object.groups.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: CollectionInfo): unknown {
    const obj: any = {};
    if (message.pages?.length) {
      obj.pages = message.pages;
    }
    if (message.groups?.length) {
      obj.groups = message.groups;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CollectionInfo>, I>>(base?: I): CollectionInfo {
    return CollectionInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CollectionInfo>, I>>(object: I): CollectionInfo {
    const message = createBaseCollectionInfo();
    message.pages = object.pages?.map((e) => e) || [];
    message.groups = object.groups?.map((e) => e) || [];
    return message;
  },
};

function createBasePage(): Page {
  return { text: undefined };
}

export const Page = {
  encode(message: Page, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.text !== undefined) {
      writer.uint32(10).string(message.text);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Page {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.text = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Page {
    return { text: isSet(object.text) ? globalThis.String(object.text) : undefined };
  },

  toJSON(message: Page): unknown {
    const obj: any = {};
    if (message.text !== undefined) {
      obj.text = message.text;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Page>, I>>(base?: I): Page {
    return Page.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Page>, I>>(object: I): Page {
    const message = createBasePage();
    message.text = object.text ?? undefined;
    return message;
  },
};

function createBaseGroup(): Group {
  return { pageId: "", members: [] };
}

export const Group = {
  encode(message: Group, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pageId !== "") {
      writer.uint32(10).string(message.pageId);
    }
    for (const v of message.members) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Group {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGroup();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pageId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.members.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Group {
    return {
      pageId: isSet(object.pageId) ? globalThis.String(object.pageId) : "",
      members: globalThis.Array.isArray(object?.members) ? object.members.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: Group): unknown {
    const obj: any = {};
    if (message.pageId !== "") {
      obj.pageId = message.pageId;
    }
    if (message.members?.length) {
      obj.members = message.members;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Group>, I>>(base?: I): Group {
    return Group.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Group>, I>>(object: I): Group {
    const message = createBaseGroup();
    message.pageId = object.pageId ?? "";
    message.members = object.members?.map((e) => e) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
