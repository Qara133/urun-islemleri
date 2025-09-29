import Vue from 'vue';
import {router} from '../../../router';
const state = {
    products: []
}

const getters = {
    getProducts(state){
        return state.products;
    },
    getProduct(state){
        return key => state.products.filter(element =>{
            return element.key == key;
        })
    }
}
const mutations = {
    updateProductList(state, product){
        state.products.push(product);
    }
}
const actions = {
    initApp({commit}){
        //Vue resource islemleri....
    Vue.http.get("https://urun-islemleri-dbc78-default-rtdb.firebaseio.com/products.json")
    .then( response => {
        let data = response.body;
        for(let key in data){
            data[key].key = key;
            commit("updateProductList", data[key]);
        }

    })
    },
    saveProduct({dispatch,commit,state}, product){
        //Vue resource islemleri....
        Vue.http.post("https://urun-islemleri-dbc78-default-rtdb.firebaseio.com/products.json", product)
        .then((response) => {
            //urun listesinin guncellenmesi
            product.key = response.body.name;
            commit("updateProductList", product);
            //Alis, satis islemlerinin yapilmasi icin store modulu olan trade'e yonlendirme
            let tradeResult = {
                purchase : product.price,
                sale : 0,
                count : product.count
            }
            dispatch("setTradeResult", tradeResult);
            router.replace("/");
            
        })
    },
    SellProduct({state,commit}, payload){
        //Vue resource islemleri.... 
        let product = state.products.filter(element =>{
            return element.key == payload.key;
        });

        if(product){
            
           // Z = X -Y

            let totalCount = product[0].count - payload.count;
             Vue.http.patch("https://urun-islemleri-dbc78-default-rtdb.firebaseio.com/products/" + payload.key + ".json", {count: totalCount})
            .then( response => {
                product[0].count = totalCount
            });
        };
    }
}



export default {
    state,
    getters,
    actions,
    mutations
}