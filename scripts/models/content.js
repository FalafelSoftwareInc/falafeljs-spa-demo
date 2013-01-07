define([
	'can',
    'app',
    'api'
], function (can, App, Api) {

	//TODO: ADJUST FOR PARSE.COM
    var Model = can.Model({
        id: 'ContentID',
        findAll: 'GET ' + Api.getContentsRestUrl(),
        findOne: 'GET ' + Api.getContentRestUrl(),
        create: 'POST ' + Api.createContentRestUrl(),
        update: 'POST ' + Api.updateContentRestUrl(),
        destroy: 'POST ' + Api.deleteContentRestUrl()
    }, {});

    return Model;
});