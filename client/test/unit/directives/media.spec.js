describe('directives.media', function () {
  var scope;

  function createMockComment(id, message, likes) {
    return {
      _id: id,
      message: message,
      likes: likes
    };
  }

  beforeEach(module('templates.app'));
  beforeEach(module('directives.media'));
  beforeEach(inject(function($rootScope, $compile, security) {
    scope = $rootScope;
    element = $compile('<media media="media" delete-label="Supprimer le media"></media>')(scope);
    security.currentUser = { _id: 'user-id' };
  }));

  describe('media', function () {
    function createMockMedia(id, text, likes, comments) {
      var media = {
        _id: id,
        text: text,
        likes: likes,
        comments: comments
      };

      media.$id = function() { return media._id; };

      return media;
    }

    it('create a media component', function() {
      scope.media = createMockMedia('media-id', 'dummy text', [], []);
      scope.$digest();
      // check buttons presence
      expect(element.find('button').length).toBe(6);
      expect(element.find('button[ng-click="removeMedia(media)"]').length).toBe(1);
      expect(element.find('button[ng-click="like()"]').length).toBe(1);
      expect(element.find('button[ng-click="unlike()"]').length).toBe(1);
      expect(element.find('button[ng-click="focusMediaCommentArea($event)"]').length).toBe(1);
      expect(element.find('button[ng-click="editMedia(media)"]').length).toBe(1);
      expect(element.find('button[ng-click="displayPreviousComments()"]').length).toBe(1);
      // comment elements presences
      expect(element.find('.media.comment').length).toBe(1);
      expect(element.find('.media.comment .media-body').length).toBe(1);
      expect(element.find('.media.comment form[ng-submit="comment()"]').length).toBe(1);
      expect(element.find('.media.comment input[type="submit"]').length).toBe(1);
      // check gravatars presence
      expect(element.find('gravatar').length).toBe(2);
      // no comments
      expect(element.find('comment').length).toBe(0);
      // no one like
      expect(element.find('.media-num-likes').text().trim()).toBe('0');
    });
  
    it('add comments and likes when existing', function() {
      scope.media = createMockMedia(
        'media-id',
        'dummy text',
        ['user-dummy-id-1', 'user-dummy-id-2'],
        [createMockComment('comment-id', 'dummy message', [])]
      );
      scope.$digest();
      expect(element.find('comment').length).toBe(1);
      expect(element.find('.media-num-likes').length).toBe(1);
      expect(element.find('.media-num-likes').text().trim()).toBe('2');
    });

    describe('like', function () {
      it('increment one like', function() {
        scope.media = createMockMedia('media-id', 'dummy text', [], []);
        scope.media.$addLike = function(success) {
          success(createMockMedia('media-id', 'dummy text', ['user-dummy-id'], []));
        };
        scope.$digest();

        expect(element.find('.media-num-likes').text().trim()).toBe('0');

        element.find('button[ng-click="like()"]').click();

        expect(element.find('.media-num-likes').text().trim()).toBe('1');
      });
    });

    describe('unlike', function () {
      it('unincrement one like', function() {
        scope.media = createMockMedia('media-id', 'dummy text', ['user-dummy-id'], []);
        scope.media.$removeLike = function(success) {
          success(createMockMedia('media-id', 'dummy text', [], []));
        };
        scope.$digest();

        expect(element.find('.media-num-likes').text().trim()).toBe('1');

        element.find('button[ng-click="unlike()"]').click();

        expect(element.find('.media-num-likes').text().trim()).toBe('0');
      });
    });
  });
});
