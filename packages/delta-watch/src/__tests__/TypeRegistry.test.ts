import DeltaWatch from '../';
import {expect} from 'chai';
import 'jest';
import {assertWatcherCalled} from "./utils";

let noteCount = 0;

class Note {
    readonly _id: number;
    private _text: string;
    private _priority: number;
    private _completed: boolean;

    constructor(text: string, priority: number) {
        this._id = noteCount++;
        this._text = text;
        this._priority = priority;
        this._completed = false;
    }

    get id(): number {
        return this._id;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get priority(): number {
        return this._priority;
    }

    set priority(value: number) {
        this._priority = value;
    }

    get isComplete(): boolean {
        return this._completed;
    }

    public finish() {
        this._completed = true;
        this._priority = null;
    }
}

const makeNoteWatcher = (data: any) => {
    let typeRegistry = DeltaWatch.NewTypeRegistry;
    typeRegistry.addClassType(Note);
    return DeltaWatch.Watchable(data, typeRegistry);
};

describe(`Type Registration`, () => {
    it(`Can create type registry with 1 custom class type`, () => {
        let typeRegistry = DeltaWatch.NewTypeRegistry;
        typeRegistry.addClassType(Note);

        expect(typeRegistry.typeCount).to.equal(1);
    });

    it(`Can watch public getter on Note`, () => {
        let {Watcher, Mutator} = makeNoteWatcher({
            note: new Note("My Note", 1)
        });

        let watcherCalled = false;
        DeltaWatch.Watch(Watcher.note.priority, (value: number) => {
            watcherCalled = true;
        });

        Mutator.note.priority = 2;

        assertWatcherCalled(watcherCalled);
    });
});