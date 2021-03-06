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

describe('StockCardSummaryRepository', function() {

    var $q, $rootScope, StockCardSummary, StockCardSummaryRepository, StockCardSummaryDataBuilder, PageDataBuilder,
        implMock, stockCardSummaryRepository, stockCardSummaryJson;

    beforeEach(function() {
        module('stock-card-summary');
        module('openlmis-pagination');

        inject(function($injector) {
            $q = $injector.get('$q');
            StockCardSummary = $injector.get('StockCardSummary');
            $rootScope = $injector.get('$rootScope');
            StockCardSummaryRepository = $injector.get('StockCardSummaryRepository');
            StockCardSummaryDataBuilder = $injector.get('StockCardSummaryDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
        });

        implMock = jasmine.createSpyObj('impl', ['query']);

        stockCardSummaryRepository = new StockCardSummaryRepository(implMock);
        stockCardSummaryJson = new StockCardSummaryDataBuilder().buildJson();
    });

    describe('query', function() {

        it('should return instance of StockCardSummary class', function() {
            var params = {
                page: 0,
                size: 10
            };

            implMock.query.andReturn($q.resolve(new PageDataBuilder().withContent([stockCardSummaryJson])
                .build()));

            var result;
            stockCardSummaryRepository.query(params)
                .then(function(page) {
                    result = page;
                });
            $rootScope.$apply();

            expect(result.content[0] instanceof StockCardSummary).toBe(true);
            expect(result.content[0]).toEqual(new StockCardSummary(stockCardSummaryJson));
            expect(implMock.query).toHaveBeenCalledWith(params);
        });

        it('should reject if implementation rejects', function() {
            implMock.query.andReturn($q.reject());

            var rejected;
            stockCardSummaryRepository.query()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });
    });
});
