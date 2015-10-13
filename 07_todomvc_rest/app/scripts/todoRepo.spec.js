/**
 * Created by Gaetan on 09/10/15.
 */



describe('todoRepo service', function(){

    var todoRepo;
    var testItem1;
    var testItem2;

    beforeEach(function(){
        todoRepo = new TodoRepo();
        testItem1 = todoRepo.add('testitem1');
        testItem2 = todoRepo.add('testitem2');
    });

    describe('add test', function() {

        it('when adding item should add to the list with correct properties', function () {
            var todo = todoRepo.add('test');
            var list = todoRepo.getList();
            expect(list.length).toBe(3);
            expect(todo.title).toBe('test');
            expect(todo.completed).toBe(false);
        });

        it('an item should be retriebed by its id', function () {
            var todo = todoRepo.add('test');
            expect(todoRepo.get(todo.id)).toBe(todo);
        });

        it('when removing, list should be shorter', function () {
            todoRepo.remove(testItem1.id);
            expect(todoRepo.getList().length).toBe(1);
        });
    });

    describe('toggle all completed status', function() {

        it('completed should return true after toggle', function () {
            todoRepo.setCompleted(true);
            expect(testItem1.completed).toBe(true);
            expect(testItem2.completed).toBe(true);
        });

    });
});
