let WsRenderer = class {
  constructor(message, status, data) {
    this.message = message
    this.status = status
    this.data = data
  }
  jsonReturn() {
    var jsonReturn = {
      meta: {
        message: this.message,
        status : this.status
      }
    }
    if (this.data != null) {
      jsonReturn.data =
        this.data
    }
    return jsonReturn
  }
}
module.exports = WsRenderer
