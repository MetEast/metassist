let express = require('express');
let router = express.Router();
let meteastDBService = require('../service/meteastDBService');

router.get('/listmeteastOrder', function(req, res) {
    let pageNumStr = req.query.pageNum;
    let pageSizeStr = req.query.pageSize;
    let blockNumberStr = req.query.blockNumber;
    let endBlockNumberStr = req.query.endBlockNumber;
    let category = req.query.category === undefined ? "" : req.query.category;
    let orderState = req.query.orderState;
    let sortType = req.query.sortType === 'price' ? 'price' : 'createTime';
    let sort = req.query.sort === "asc" ? 1 : -1;

    let pageNum, pageSize, blockNumber, endBlockNumber;

    try {
        if(pageNumStr) {
            pageNum = parseInt(pageNumStr);
            if(!pageSizeStr) {
                pageSize = 20;
            } else {
                pageSize = parseInt(pageSizeStr);
            }
        }

        if(blockNumberStr) {
            blockNumber = parseInt(blockNumberStr);
        }

        if(endBlockNumberStr) {
            endBlockNumber = parseInt(endBlockNumberStr);
        }

        if(pageNum < 1 || pageSize < 1) {
            res.json({code: 400, message: 'bad request'})
            return;
        }
    } catch (e) {
        console.log(e);
        res.json({code: 400, message: 'bad request'});
        return;
    }

    meteastDBService.listmeteastOrder(pageNum, pageSize, blockNumber, endBlockNumber, orderState, sortType, sort, category).then(result => {
        res.json(result);
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
});

router.get('/allSaleOrders', function (req, res) {
    let sortType = req.query.sortType === 'price' ? 'price' : 'createTime';
    let sort = req.query.sort === 'asc' ? 1 : -1;
    let category = req.query.category === undefined ? '' : req.query.category;

    let pageNumStr = req.query.pageNum;
    let pageSizeStr = req.query.pageSize;

    let pageNum, pageSize;
    try {
        if(pageNumStr) {
            let number = parseInt(pageNumStr);
            pageNum = number > 0 ? number : 1;

            if(pageSizeStr) {
                let size = parseInt(pageSizeStr);
                pageSize = size > 0 ? size <= 100 ? size : 20 : 20;
            } else {
                pageSize = 20;
            }
        }
    } catch (e) {
        console.log(e);
        res.json({code: 400, message: 'bad request'});
        return;
    }


    meteastDBService.allSaleOrders(sortType, sort, pageNum, pageSize, category).then(result => {
        res.json(result);
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
})

router.get('/searchSaleOrders', function (req, res) {
    let searchType = req.query.searchType;
    let key = req.query.key;
    let category = req.query.category === undefined ? undefined : req.query.category;

    if(!key) {
        res.json({code: 400, message: 'bad request'});
        return;
    }

    if(key.startsWith('0x') && key.length > 42) {
        key = BigInt(key).toFormat({prefix:""});
    }

    if(!['tokenId', 'royaltyAddress', 'ownerAddress', 'name', 'description'].includes(searchType)) {
        searchType = undefined;
    }

    meteastDBService.searchSaleOrders(searchType, key, category).then(result => {
        res.json(result);
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
})

router.get('/whitelist', function(req, res) {
    let address = req.query.address;

    meteastDBService.getWhitelist(address).then(result => {
        res.json(result);
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
})

router.get('/getDidByAddress', function(req, res) {
    let address = req.query.address;

    meteastDBService.getDidByAddress(address).then(result => {
        res.json({code: 200, message: 'success', data: result});
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
})

router.get('/getDidByDid', function(req, res) {
    let did = req.query.did;

    meteastDBService.getDidByDid(did).then(result => {
        res.json({code: 200, message: 'success', data: result});
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
})

router.get('/insertTokenToBlindBox', function(req, res) {
    let blindboxIndex = req.query.blindboxIndex;
    let tokenIds = req.query.tokenIds

    meteastDBService.insertTokenToBlindBox(blindboxIndex, tokenIds).then(result => {
        res.json({code: 200, message: 'success', data: result});
    }).catch(error => {
        console.log(error);
        res.json({code: 500, message: 'server error'});
    })
})

module.exports = router;
