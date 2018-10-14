import {ObjectWatcher} from "../core/ObjectWatcher";
import {makeObjectMutator} from "../core/ObjectMutator";
import {makeObjectAccessor} from "../core/ObjectAccessor";
import {ArrayTypeInfo} from "./ArrayType";
import {DateTypeInfo} from "./DateType";

export interface TypeInfo {
  makeMutator: (watcher: ObjectWatcher) => any
  makeAccessor: (obj: any, typeRegister: TypeRegistry) => any
  handlesValue: (value: any) => boolean
  type: string
}

export class TypeRegistry {
  static get defaultTypeRegistry() {
    return new TypeRegistry([
      DateTypeInfo,
      ArrayTypeInfo
    ]);
  }

  private readonly _types: TypeInfo[];

  constructor(types: TypeInfo[]) {
    this._types = types;
  }

  getMakeAccessorForValue(value: any): (obj: any, typeRegister: TypeRegistry) => any {
    let accessor = null;
    for (let info of this._types) {
      if (info.handlesValue(value)) {
        accessor = info.makeAccessor;
        break;
      }
    }

    if (accessor === null
      && typeof value === "object"
      && value !== null) { // Don't handle null by default, if a custom type want's to handle it accessor won't be null for this check
      return makeObjectAccessor;
    }

    return accessor;
  }

  getMakeMutatorForValue(value: any): (watcher: ObjectWatcher) => any {
    let mutator = null;
    for (let info of this._types) {
      if (info.handlesValue(value)) {
        mutator = info.makeMutator;
      }
    }

    if (mutator === null
      && (typeof value === 'object' || typeof value === 'undefined')) {
      mutator = makeObjectMutator;
    }

    return mutator;
  }

  getTypeForValue(value: any): string {
    let type = "";
    for (let info of this._types) {
      if (info.handlesValue(value)) {
        type = info.type
      }
    }
    if (type === "" && typeof value === "object") {
      type = "Object";
    }
    return type;
  }
}