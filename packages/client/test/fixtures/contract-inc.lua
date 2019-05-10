-- aergoluac --abi contract-inc.abi.json contract-inc.lua contract-inc.out
-- aergoluac --payload ./contract-inc.lua > contract-inc.txt

state.var {
    Value = state.value()
}

function constructor(init_value)
    Value:set(init_value)
end

function inc()
    a = Value:get()
    Value:set(a + 1)
    contract.event("incremented", a, a + 1) 
end

function query(a)
    return Value:get()
end

abi.register(inc, query)