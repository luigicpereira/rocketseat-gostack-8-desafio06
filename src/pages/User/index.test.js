const index = require("./index")
// @ponicode
describe("componentDidMount", () => {
    let inst

    beforeEach(() => {
        inst = new index.default()
    })

    test("0", async () => {
        await inst.componentDidMount()
    })
})

// @ponicode
describe("refreshList", () => {
    let inst

    beforeEach(() => {
        inst = new index.default()
    })

    test("0", async () => {
        await inst.refreshList()
    })
})
