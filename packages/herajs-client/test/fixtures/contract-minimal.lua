-- aergoluac --abi contract-inc.abi.json contract-inc.lua contract-inc.out
-- aergoluac --payload ./contract-inc.lua > contract-inc.txt

function a()
    return system.getCreator()
end

abi.register(a)