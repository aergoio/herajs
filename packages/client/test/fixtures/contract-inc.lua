-- aergoluac --abi contract-inc.abi.json contract-inc.lua contract-inc.out
-- aergoluac --payload ./contract-inc.lua > contract-inc.txt

state.var {
    Value = state.value(),
    Items = state.map(),
    List = state.array()
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

function set(key, value)
    Items[key] = value
end

function get(key)
    return Items[key]
end

function addItem(item)
    List:append(item)
end

function getItem(index)
    return List[index]
end

abi.register(inc, query, set, get, addItem, getItem)