pragma solidity ^0.5.16;

contract ProductVerification {
    struct FakeReport {
        address reporter;
        string productId;
        string location;
        uint256 timestamp;
    }

    mapping(string => FakeReport) public fakeReports;
    event FakeProductReported(address indexed reporter, string productId, string location, uint256 timestamp);

    function reportFakeProduct(string memory _productId, string memory _location) public {
        require(bytes(fakeReports[_productId].productId).length == 0, "Product already reported as fake.");

        fakeReports[_productId] = FakeReport({
            reporter: msg.sender,
            productId: _productId,
            location: _location,
            timestamp: now
        });

        emit FakeProductReported(msg.sender, _productId, _location, now);
    }
}
