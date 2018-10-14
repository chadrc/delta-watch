import DeltaWatch from '../';
import {expect} from 'chai';
import 'jest';

let noteCount = 0;

class Note {
    _id: number;
    _text: string;
    _priority: number;
    _completed: boolean;

    public Note(text: string, priority: number) {
        this._id = noteCount++;
        this._text = text;
        this._priority = priority;
        this._completed = false;
    }

    finish() {
        this._completed = true;
        this._priority = null;
    }
}

describe(`Type Registration`, () => {
    it(`Can create type registry with 1 custom class type`, () => {
        let typeRegistry = DeltaWatch.NewTypeRegistry;
        typeRegistry.addClassType(Note);

        expect(typeRegistry.typeCount).to.equal(1);
    });


});