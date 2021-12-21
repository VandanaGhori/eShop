import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        inCart: [],
        login: {
            username: '',
            password: ''
        },
        purchasedProducts: [
            {
                pId: 1,
                uEmail: 'vidhi@gmail.com'
            },
            {
                pId: 1,
                uEmail: 'sree@gmail.com'
            },
            {
                pId: 2,
                uEmail: 'vidhi@gmail.com'
            },
            {
                pId: 5,
                uEmail: 'vidhi@gmail.com'
            }
        ],
        comments: [
            {
                pId: 1,
                text: "Good quality watch! Highly recommended!",
                rating: 5,
                user: "Vidhi"
            },
            {
                pId: 1,
                text: "It's good but costly.",
                rating: 4,
                user: "Sree"
            },
            {
                pId: 2,
                text: "It is not working after 3 months of use.",
                rating: 1,
                user: "Vidhi"
            },
            {
                pId: 5,
                text: "Very helpful.",
                rating: 5,
                user: "Vidhi"
            }
        ],
    },
    getters: {
        inCart: state => state.inCart,
        cartItem: state => (id) => {
            return state.inCart.find(i => i.id === id)
        },
        login: state => state.login,
        qtyReturn: state => (id) => {
            let item = state.inCart.find(i => i.id === id)
            return (item != null) ? item.qty : 1;
        },
        purchasedProducts: state => state.purchasedProducts,
        comments: state => state.comments,
    },
    mutations: {
        ADD_TO_CART(state, pId) {
            let item = this.getters.cartItem(pId);
            if (item == null) {
                state.inCart.push({ id: pId, qty: 1 });
            }
            console.log(state.inCart)
        },
        REMOVE_FROM_CART(state, id) {
            let item = this.getters.cartItem(id);
            if (item != null) {
                state.inCart.splice(state.inCart.indexOf(item), 1);
            }
        },
        CHANGE_QTY_CART(state, data) {
            if (data.qty > 0) {
                let item = this.getters.cartItem(data.id);
                if (item != null) {
                    item.qty = data.qty;
                    Vue.set(state.inCart, state.inCart.indexOf(item), item)
                }
            }
        },
        CLEAR_CART(state) {
            state.inCart.splice(0, state.inCart.length);
        },
        ADD_PURCHASED_PRODUCT(state, data) {
            state.purchasedProducts.push(data);
        },
        LOGIN(state, sessionData) {
            state.login.username = sessionData.username;
            state.login.password = sessionData.password;
        },
        ADD_TO_CART_WITH_QTY(state, data) {
            let item = this.getters.cartItem(data.id);
            if (item == null) {
                state.inCart.push({ id: data.id, qty: data.qty });
            }
            console.log(state.inCart)
        },
        ADD_COMMENT(state, data) {
            state.comments.push(data)
        }
    },
    actions: {
        addToCart(context, id) { context.commit('ADD_TO_CART', id); },
        removeFromCart(context, id) { context.commit('REMOVE_FROM_CART', id); },
        changeQtyCart(context, data) {
            context.commit('CHANGE_QTY_CART', data);
        },
        clearCart(context) {
            context.commit('CLEAR_CART');
        },
        addPurchasedProduct(context, data) {
            context.commit('ADD_PURCHASED_PRODUCT', data);
        },
        login(context, sessionData) {
            context.commit('LOGIN', sessionData);
        },
        addToCartWithQty(context, data) {
            console.log("Data" + JSON.stringify(data));
            context.commit('ADD_TO_CART_WITH_QTY', data);
        },
        addComment(context, data) {
            context.commit('ADD_COMMENT', data);
        }
    }
}
);