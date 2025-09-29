<template>
  <div class="container">
    <!-- Loading -->
    <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="row">
      <div class="col-6 offset-3 pt-3 card mt-5 shadow">
        <div class="card-body">
          <h3>Ürün Çıkışı</h3>
          <hr>

          <!-- Ürün Seçimi -->
          <div class="form-group">
            <label>Ürün Adı</label>
            <select class="form-control" v-model="selectedProduct" @change="productSelected">
              <option selected disabled>Lütfen Bir Ürün Seçiniz...</option>
              <option
                v-for="product in getProducts"
                :key="product.key"
                :value="product.key"
                :disabled="product.count === 0">
                {{ product.title }}
              </option>
            </select>
          </div>

          <!-- Ürün Detayları -->
          <transition name="fade" mode="out-in">
            <div class="card mb-2 border border-danger" v-if="product !== null">
              <div class="card-body">
                <div class="row">
                  <div class="col-12 text-center">
                    <div class="mb-3">
                      <span class="badge badge-info">Stok : {{ product.count }}</span>
                      <span class="badge badge-primary">Fiyat : {{ product.price | currency }}</span>
                    </div>
                    <p class="border border-warning p-2 text-secondary">{{ product.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Adet -->
          <div class="form-group">
            <label>Adet</label>
            <input type="text" v-model="product_count" class="form-control" placeholder="Ürün adetini giriniz..">
          </div>

          <hr>
          <button @click="save" :disabled="saveEnabled" class="btn btn-primary">Kaydet</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      selectedProduct: null,
      product: null,
      product_count: null,
      saveButtonClicked: false,
    };
  },
  computed: {
    ...mapGetters(["getProducts"]),
    saveEnabled() {
      return !(this.selectedProduct !== null && this.product_count > 0);
    },
    isLoading() {
      return {
        display: this.saveButtonClicked ? "block" : "none",
      };
    },
  },
  methods: {
    productSelected() {
      this.product = this.$store.getters.getProduct(this.selectedProduct)[0];
    },
    save() {
      if (!this.selectedProduct || this.product_count <= 0) return;

      this.saveButtonClicked = true;

      const product = {
        key: this.selectedProduct,
        count: this.product_count,
      };

      // Vuex action Promise qaytarmalıdır
      this.$store.dispatch("SellProduct", product).then(() => {
        // Loading-i gizlət
        this.saveButtonClicked = false;
        // Formu sıfırla
        this.selectedProduct = null;
        this.product_count = null;
        this.product = null;
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if ((this.selectedProduct !== null || this.product_count > 0) && !this.saveButtonClicked) {
      if (confirm("Kaydedilmemiş değişiklikler var. Yine de çıkmak istiyor musunuz?")) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.border-danger {
  border-style: dashed !important;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #007bff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>
