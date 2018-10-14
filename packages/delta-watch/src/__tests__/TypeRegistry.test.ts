import DeltaWatch from '../';
import {expect} from 'chai';
import 'jest';

class Note {
    id: string;
    text: string;
    priority: number;
}

describe(`Type Registration`, () => {
    it(`Can create type registry with 1 custom class type`, () => {
        let typeRegistry = DeltaWatch.NewTypeRegistry;
        typeRegistry.addClassType(Note);

        expect(typeRegistry.typeCount).to.equal(1);
    });


});