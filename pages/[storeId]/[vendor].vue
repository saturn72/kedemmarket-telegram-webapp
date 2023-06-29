<template>
  <v-container fluid>
    <v-row justify="center">
      {{ vendorName }}
      <v-col cols="12" v-for="product in vendor.products" :key="product.id">
        <v-card>
          <v-img :src="product.image" height="100"></v-img>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-text>{{ product.description }}</v-card-text>
          <v-card-actions>
            <v-btn text>Price: {{ product.price }}</v-btn>
            <v-btn @click="addToCart(product)" color="primary">Add to Cart</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

const params = useRoute().params;
const storeId = params.storeId.toLocaleLowerCase();
const vendorName = params.vendor.toLocaleLowerCase();

const { $storage } = useNuxtApp();
var url = await $storage.getDownloadUrl(`catalog/${storeId}/${vendorName}.json`)
const { data: vendor, pending, error } = await useFetch(() => url)

// products = [
//   { id: 1, name: "p-name-1", price: 1.1 },
//   { id: 2, name: "p-name-2", price: 2.2 },
//   { id: 3, name: "p-name-3", price: 3.3 },
//   { id: 4, name: "p-name-4", price: 4.4 }
// ];
//console.log("res")
// console.log("res = " + res);

// const appConfig = useAppConfig()

// const u = `${appConfig.catalogUrl}%2F${storeId}%2F${vendorName}.json?alt=media&token=c3c42b91-056e-4a41-aba2-6b9ad987738c`;

// const vr = useStorageFileUrl(`catalog/${storeId}/${vendorName}.json`)

</script>

<script>
// import { storage } from '@/plugins/firebase';
// import { Component, Vue } from 'nuxt-property-decorator';

// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: string;
//   image: string;
// }

export default {
  name: "Store",
  // async fetch() {
  //   console.log($route.params)
  //   this.store = {
  //     name: "storename from json"
  //   };
  //   this.products = [
  //     { id: 1, name: "p-name-1", price: 1.1 },
  //     { id: 2, name: "p-name-2", price: 2.2 },
  //     { id: 3, name: "p-name-3", price: 3.3 },
  //     { id: 4, name: "p-name-4", price: 4.4 }
  //   ];
  //   // const name = this.$route.params.name;
  //   // const uri = `${uris.page.store}${name}?includeProducts=true`;

  //   // var data = await this.$axios.$get(uri);
  //   // this.store = _.cloneDeep(data.store);
  //   // this.products = this.store.productsPage.items
  // },
  data() {
    return {
      vendor: {},
      products: [],
      search: "",
      // sortDesc: false,
      // sortBy: "name",
      // address: {},
      // products: [],
      // categories: []
    };
  },
  methods: {
    // async mounted(): Promise<void> {
    //   try {
    //     // Fetch product data from Firebase Storage
    //     const productsRef = storage.ref('products.json');
    //     const productsSnapshot = await productsRef.getDownloadURL();
    //     const productsResponse = await fetch(productsSnapshot);
    //     this.products = await productsResponse.json();
    //   } catch (error) {
    //     console.error('Error fetching product data:', error);
    //   }
    // }
    addToCart(product) {
      console.log("add to cart");
      // Logic to add the product to the cart
    }
  }
}
</script>

<!-- <template>
  <v-container fluid>
    <StoreProfileCardTitle :store="store"></StoreProfileCardTitle>
    <v-data-iterator :items="products" :custom-filter="filter" :search="search" hide-default-footer class="mb-12">
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="product in props.items" :key="product.id" cols="12" sm="6" md="4" lg="3">
            <ProductCard :product="product"></ProductCard>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
        <v-toolbar flat>
        </v-toolbar>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>
// const categoriesSearchTerm = "categories:";
// const searchTermDelimiter = "|";

// import { vxm } from '~/store';
// import { externals as uris } from '~/uris';
// import ProductCard from "./components/ProductCard/index.vue";

export default {
  name: "Store",
  // auth: false,
  // components: {
  //   ProductCard
  // },
  async fetch() {
    this.store = {
      name: "kedemmarket"
    };
    // const name = this.$route.params.name;
    // const uri = `${uris.page.store}${name}?includeProducts=true`;

    // var data = await this.$axios.$get(uri);
    // this.store = _.cloneDeep(data.store);
    // this.products = this.store.productsPage.items
  },
  data() {
    return {
      store: { name: "not-final-name" },
      products: [
        { id: 1, name: "p-name-1", price: 1.1 },
        { id: 2, name: "p-name-2", price: 2.2 },
        { id: 3, name: "p-name-3", price: 3.3 },
        { id: 4, name: "p-name-4", price: 4.4 }
      ],
      search: "",
      // sortDesc: false,
      // sortBy: "name",
      // address: {},
      // products: [],
      // categories: []
    };
  },
  // computed: {
  //   isXs() {
  //     return this.$vuetify.breakpoint.name == 'xs';
  //   },
  //   search() {
  //     return vxm.search.searchTerm;
  //   }
  // },
  // methods: {
  //   toggleCategories(categories) {
  //     const searchParts = [];
  //     this.search.split(searchTermDelimiter)
  //       .map(s => {
  //         if (!s.startsWith(categoriesSearchTerm)) {
  //           searchParts.push(s);
  //         }
  //       });

  //     this.search = "";
  //     for (let index = 0; index < searchParts.length; index++) {
  //       if (this.search.length > 0) {
  //         this.search += searchTermDelimiter;
  //       };
  //       this.search += searchParts[index];
  //     }
  //     if (categories.length > 0) {
  //       this.search += categoriesSearchTerm + categories;
  //     }
  //   },
  //   filter(items, search) {
  //     if (search.length == 0) {
  //       return items;
  //     }
  //     const searchParts = search
  //       .split(searchTermDelimiter)
  //       .map(x => x.trim());

  //     const res = [];
  //     for (let index = 0; index < searchParts.length; index++) {
  //       const curSP = searchParts[index];
  //       if (curSP.startsWith(categoriesSearchTerm)) {
  //         res.push(...this.filterByCategories(curSP, items));
  //         continue;
  //       }
  //       res.push(...this.filterByFullText(curSP, items));
  //     }

  //     return [...new Set(res)];
  //   },
  //   filterByFullText(fullTextTerm, items) {
  //     const fields = ['name', 'description', 'priceText'];
  //     const res = [];
  //     const fts = fullTextTerm.toLowerCase();
  //     for (let i = 0; i < items.length; i++) {
  //       const cur = items[i];

  //       if (fields.some(e => cur[e] && cur[e].toLowerCase().includes(fts))) {
  //         res.push(cur);
  //       }
  //     }
  //     return res;
  //   },
  //   filterByCategories(searchTerm, items) {
  //     const cats = searchTerm.replace(categoriesSearchTerm, '').split(",");
  //     const res = [];

  //     for (let i = 0; i < cats.length; i++) {
  //       const c = cats[i].trim();
  //       const tmp = items.filter(x => x.categories.includes(c));
  //       res.push(...tmp);
  //     }
  //     return [...new Set(res)];
  //   }
  // },
}
</script> -->
