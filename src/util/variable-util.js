class VariableUtil {
    static _mergeVarRefObjects (accum, obj2) {
        for (const id in obj2) {
            if (accum[id]) {
                accum[id] = accum[id].concat(obj2[id]);
            } else {
                accum[id] = obj2[id];
            }
        }
        return accum;
    }

    /**
     * Get all variable/list references in the given list of targets
     * in the project.
     * @param {Array.<Target>} targets The list of targets to get the variable
     * and list references from.
     * @return {object} An object with variable ids as the keys and a list of block fields referencing
     * the variable.
     */
    static getAllVarRefsForTargets (targets) {
        return targets
            .map(t => t.blocks.getAllVariableAndListReferences())
            .reduce(VariableUtil._mergeVarRefObjects, {});
    }

    /**
     * Merge variable references with another variable.
     * @param {string} idToBeMerged ID of the variable whose references need to be updated
     * @param {string} idToMergeWith ID of the variable that the old references should be replaced with
     * @param {Array<object>} referencesToUpdate Context of the change, the object containing variable
     * references to update.
     * @param {?string} optNewName New variable name to merge with. The old
     * variable name in the references being updated should be replaced with this new name.
     * If this parameter is not provided or is '', no name change occurs.
     */
    static mergeVariables (idToBeMerged, idToMergeWith, referencesToUpdate, optNewName) {
        referencesToUpdate.map(ref => {
            ref.referencingField.id = idToMergeWith;
            if (optNewName) {
                ref.referencingField.value = optNewName;
            }
            return ref;
        });
    }
}

module.exports = VariableUtil;
