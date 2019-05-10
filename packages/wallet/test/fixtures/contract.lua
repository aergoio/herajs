

-- aergoluac --abi contract.abi.json contract.lua contract.out
-- aergoluac --payload ./contract.lua > contract.txt

state.var {
    Value = state.value()
}

function constructor(init_value)
    Value:set(init_value)
end

function returnValue()
    return Value:get()
end

function alwaysFail()
    assert(false, "failed as expected")
end

abi.register(returnValue, alwaysFail)