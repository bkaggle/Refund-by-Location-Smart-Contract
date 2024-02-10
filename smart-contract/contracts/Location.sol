// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Location {
    address public employer;
    address[] public employees;

    struct ContractStatus {
        int8 cenLat;
        int8 cenLon;
        int8 radius;
        uint8 payAmount;
        uint8 compCount;
        uint8 reqAmount;
    }

    mapping(address => ContractStatus) public empContractStatus;

    constructor () {
        employer = msg.sender;
    }

    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer has access to this function");
        _;
    }

    modifier onlyEmployee(address _addr) {
        require(msg.sender == _addr, "Only an employee has access to this function");
        bool exists = false;

        for (uint256 i = 0; i < employees.length; i++) {
            if (employees[i] == _addr) {
                exists = true;
                break;
            }
        }

        require(exists, "Only an employee has access to this function");
        _;
    }

    function sqrt(int256 input) private pure returns (int256 output) {
        int256 temp = (input + 1) / 2;
        output = input;
        while (temp < output) {
            output = temp;
            temp = ((input / output) * 2) / 2;
        }
    }

    function getDistance(int8 _lat, int8 _lon) private view returns (int256 dist) {
        int256 x = _lat - empContractStatus[msg.sender].cenLat;
        int256 y = _lon - empContractStatus[msg.sender].cenLon;
        dist = sqrt(x**2 + y**2);
        return dist;
    }

    function setAccount(
        address _empAddr,
        int8 _cenLat,
        int8 _cenLon,
        int8 _radius,
        uint8 _payAmount,
        uint8 _reqAmount
    ) public onlyEmployer() {
        employees.push(_empAddr);
        empContractStatus[_empAddr].cenLat = _cenLat;
        empContractStatus[_empAddr].cenLon = _cenLon;
        empContractStatus[_empAddr].radius = _radius;
        empContractStatus[_empAddr].payAmount = _payAmount;
        empContractStatus[_empAddr].compCount = 0;
        empContractStatus[_empAddr].reqAmount = _reqAmount;
    }

    function updateStatus(int8 _lat, int8 _lon) public {
        int256 dist = getDistance(_lat, _lon);
        if (dist < empContractStatus[msg.sender].radius) {
            empContractStatus[msg.sender].compCount += 1;
        }
    }

    function payMe(address payable _to) public payable onlyEmployee(_to) {
        require(empContractStatus[_to].compCount > empContractStatus[_to].reqAmount, "Payment conditions not met");
        bool sent = _to.send(empContractStatus[_to].payAmount);
        require(sent, "Failed to send Ether");
    }

    function getAdmin() public view returns(address) {
        return employer;
    }
}
