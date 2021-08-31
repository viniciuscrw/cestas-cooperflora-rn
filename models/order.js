class Order {
    constructor(id, userId, deliveryId, basicProducts, extraProducts, totalAmount, date){
        this.id = id;
        this.userId = userId;
        this.deliveryId = deliveryId;
        this.basicProducts = basicProducts;
        this.extraProducts = extraProducts;
        this.totalAmount = totalAmount;
        this.date = date;
    }
}

export default Order;