const rest = require('../../utils/rest.js');
const check = require('core-node').check;
const Resource = require('../../utils/resource.js').Resource


class Log extends Resource {
    /**
     *
     * Transfer Log object
     *
     * @description Every time a Transfer entity is modified, a corresponding Transfer Log
     * is generated for the entity. This log is never generated by the
     * user.
     *
     * Attributes:
     * @param id [string]: unique id returned when the log is created. ex: '5656565656565656'
     * @param transfer [Transfer]: Transfer entity to which the log refers to.
     * @param errors [list of strings]: list of errors linked to this BoletoPayment event.
     * @param type [string]: type of the Transfer event which triggered the log creation. ex: 'processing' or 'success'
     * @param created [string]: creation datetime for the log. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ created, type, errors, transfer, id }) {
        super(id);
        this.created = check.datetime(created);
        this.type = type;
        this.errors = errors;
        this.transfer = transfer;
    }
}

exports.Log = Log;
let resource = {'class': exports.Log, 'name': 'TransferLog'};


exports.get = async function (id, {user} = {}) {
    /**
     *
     * Retrieve a specific Transfer Log
     *
     * @description Receive a single Transfer Log object previously created by the Stark Bank API by passing its id
     *
     * Parameters (required):
     * @param id [string]: object unique id. ex: '5656565656565656'
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkbank.user was set before function call
     *
     * Return:
     * @returns Transfer Log object with updated attributes
     *
     */
    return rest.getId(resource, id, user);
};

exports.query = async function ({limit, after, before, types, transferIds, user} = {}) {
    /**
     *
     * Retrieve Transfer Logs
     *
     * @description Receive a generator of Transfer Log objects previously created in the Stark Bank API
     *
     * Parameters (optional):
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: 'success' or 'failed'
     * @param transferIds [list of strings, default null]: list of Transfer ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Project object, default null]: Project object. Not necessary if starkbank.user was set before function call
     *
     * Return:
     * @returns list of Transfer Log objects with updated attributes
     *
     */
    let query = {
        limit: limit,
        after: after,
        before: before,
        types: types,
        transferIds: transferIds,
    };
    return rest.getList(resource, query, user);
};

exports.page = async function ({ cursor, limit, after, before, types, transferIds, user } = {}) {
    /**
     *
     * Retrieve paged Transfer Logs
     *
     * @description Receive a list of up to 100 Transfer.Log objects previously created in the Stark Bank API and the cursor to the next page.
     * Use this function instead of query if you want to manually page your requests.
     *
     * Parameters (optional):
     * @param cursor [string, default null]: cursor returned on the previous page function call
     * @param limit [integer, default null]: maximum number of objects to be retrieved. Unlimited if null. ex: 35
     * @param after [string, default null] date filter for objects created only after specified date. ex: '2020-03-10'
     * @param before [string, default null] date filter for objects created only before specified date. ex: '2020-03-10'
     * @param types [list of strings, default null]: filter retrieved objects by types. ex: 'success' or 'failed'
     * @param transferIds [list of strings, default null]: list of Transfer ids to filter retrieved objects. ex: ['5656565656565656', '4545454545454545']
     * @param user [Project object, default null]: Project object. Not necessary if starkbank.user was set before function call
     *
     * Return:
     * @returns list of Transfer Log objects with updated attributes and cursor to retrieve the next page of Boleto objects
     *
     */
    let query = {
        cursor: cursor,
        limit: limit,
        after: after,
        before: before,
        types: types,
        transferIds: transferIds,
    };
    return rest.getPage(resource, query, user);
};
