/**
 * Created by Gaetan on 09/10/15.
 */

describe('utilities service', function() {
    describe('pluralize test', function() {
        it('should return plural when count > 1', function() {
            var result = util.pluralize(2, 'tester');
            expect(result).toBe('testers');
        })

        it('should return singular when count == 1', function() {
            var result = util.pluralize(1, 'tester');
            expect(result).toBe('tester');
        })

        it('should return undefined when word is undefined', function() {
            var result = util.pluralize(2, undefined);
            expect(result).toBe(undefined);
        })
    });

    describe('uuid test', function() {
        it('should return length = to 36', function() {
            var result = util.uuid();
            expect(result.length).toBe(36);
        })
    });
});
