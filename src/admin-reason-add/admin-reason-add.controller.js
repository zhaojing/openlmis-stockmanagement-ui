/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */
(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name admin-reason-add.controller:AdminReasonAddController
     *
     * @description
     * Exposes method for creating/updating reason to the modal view.
     */
    angular
        .module('admin-reason-add')
        .controller('AdminReasonAddController', controller);

    controller.$inject = [
        '$q', 'reasonTypes', 'reasonCategories', 'reasons', 'programs', 'facilityTypes', 'StockReasonResource', '$state',
        'loadingModalService', 'notificationService', 'messageService', '$filter', 'validReasonService', '$stateParams',
        'availableTags'
    ];

    function controller($q, reasonTypes, reasonCategories, reasons, programs, facilityTypes, StockReasonResource, $state,
                        loadingModalService, notificationService, messageService, $filter, validReasonService,
                        $stateParams, availableTags) {
        var vm = this;

        vm.$onInit = onInit;
        vm.createReason = createReason;
        vm.addAssignment = addAssignment;
        vm.removeAssignment = removeAssignment;
        vm.getProgramName = getProgramName;
        vm.getFacilityTypeName = getFacilityTypeName;
        vm.validateReasonName = validateReasonName;

        /**
         * @ngdoc property
         * @propertyOf admin-reason-add.controller:AdminReasonAddController
         * @type {Array}
         * @name availableTags
         *
         * @description
         * The list of all available tags user throughout other reasons.
         */
        vm.availableTags = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name $onInit
         *
         * @description
         * Initialization method of the AdminReasonAddController.
         */
        function onInit() {
            vm.reason = {
                isFreeTextAllowed: false,
                reasonType: reasonTypes[0],
                tags: []
            };
            vm.reasonTypes = reasonTypes;
            vm.reasonCategories = reasonCategories;
            vm.assignments = [];
            vm.programs = programs;
            vm.facilityTypes = facilityTypes;
            vm.isValidReasonDuplicated = false;
            vm.showReason = true;
            vm.availableTags = availableTags;
        }

        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name addAssignment
         *
         * @description
         * Adds valid reason assignment.
         *
         * @return {Promise} the promise resolving to the added assignment.
         */
        function addAssignment() {
            var assignment = {
                program: {
                    id: vm.selectedProgram.id
                },
                facilityType: {
                    id: vm.selectedFacilityType.id
                },
                hidden: !vm.showReason
            };

            var duplicated = $filter('filter')(vm.assignments, {
                program: {
                    id: vm.selectedProgram.id
                },
                facilityType: {
                    id: vm.selectedFacilityType.id
                }
            }, true);

            if (duplicated[0]) {
                vm.isValidReasonDuplicated = true;
                return $q.reject();
            }
            vm.isValidReasonDuplicated = false;

            vm.assignments.push(assignment);

            vm.selectedProgram = undefined;
            vm.selectedFacilityType = undefined;
            vm.show = true;

            return $q.when(assignment);
        }

        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name remove
         *
         * @description
         * Remove an assignment.
         *
         * @param {Object} assignment   given assignment.
         */
        function removeAssignment(assignment) {
            var index = vm.assignments.indexOf(assignment);
            vm.assignments.splice(index, 1);
        }


        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name getProgramName
         *
         * @description
         * Returns program by given program id.
         *
         * @param  {String} id       program UUID
         * @return {String}          program name
         */
        function getProgramName(id) {
            var program = $filter('filter')(vm.programs, {
                id: id
            }, true);

            if (program && program.length) {
                return program[0].name;
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name getFacilityTypeName
         *
         * @description
         * Returns facility type by given facility type id.
         *
         * @param  {String} id       facility type UUID
         * @return {String}          facility type name
         */
        function getFacilityTypeName(id) {
            var facilityType = $filter('filter')(vm.facilityTypes, {
                id: id
            }, true);

            if (facilityType && facilityType.length) {
                return facilityType[0].name;
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name createReason
         *
         * @description
         * Creates the reason.
         *
         * @return {Promise} the promise resolving to the created reason
         */
        function createReason() {
            loadingModalService.open();
            return new StockReasonResource().create(vm.reason).then(function(reason) {
                var requests = [];

                angular.forEach(vm.assignments, function(assignment) {
                    assignment.reason = {
                        id: reason.id
                    };
                    requests.push(validReasonService.create(assignment));
                });

                return $q.all(requests).then(function() {
                    return reason;
                });
            }).then(function() {
                $state.go('openlmis.administration.reasons', $stateParams, {
                    reload: true
                });
                notificationService.success('adminReasonAdd.reasonCreatedSuccessfully');
            }).catch(loadingModalService.close);
        }

        /**
         * @ngdoc method
         * @methodOf admin-reason-add.controller:AdminReasonAddController
         * @name validateReasonName
         *
         * @description
         * Validates the entered reason name.
         *
         * @return {String} the error message key, undefined if reason is valid
         */
        function validateReasonName() {
            if (checkDuplication()) {
                return 'adminReasonAdd.reasonNameDuplicated';
            }
        }

        function checkDuplication() {
            if (_.isEmpty(vm.reason.name)) {
                return false;
            }

            return _.chain(reasons)
            .map(function(reason) {
                return reason.name.toUpperCase();
            }).contains(vm.reason.name.toUpperCase()).value();
        }
    }
})();