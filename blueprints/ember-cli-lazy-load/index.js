'use strict';

module.exports = {
    description: 'Generates a placeholder bundle config.'

    /**
     * Default blueprint don't need an entry name
     * @param entityName
     * @returns {string}
     */
    normalizeEntityName: function(entityName) {
        return ""
    },
};