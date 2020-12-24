import createDataContext from './createDataContext';
import {
  deleteDoc,
  get,
  getOrderingBy,
  insertDoc,
  updateDoc,
} from '../api/firebase';
import GLOBALS from '../Globals';

const productReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_products':
      return {
        loading: false,
        products: action.payload,
      };
    case 'add_product':
      return { ...state, loading: false };
    case 'update_product':
      return { ...state, loading: false };
    case 'delete_product':
      return { ...state, loading: false };
    case 'loading':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const fetchProducts = (dispatch) => async () => {
  dispatch({ type: 'loading' });
  console.log('Fetching products...');

  const products = await getOrderingBy(GLOBALS.COLLECTION.PRODUCTS, 'name');

  dispatch({
    type: 'fetch_products',
    payload: products,
  });
};

const createProduct = (dispatch) => async ({ product }) => {
  dispatch({ type: 'loading' });
  console.log('Creating new product: ' + JSON.stringify(product));

  await insertDoc(GLOBALS.COLLECTION.PRODUCTS, product);
  dispatch({ type: 'add_product' });
};

const updateProduct = (dispatch) => async ({ productId, updatedProduct }) => {
  dispatch({ type: 'loading' });
  console.log(
    'Updating product ' + productId + ': ' + JSON.stringify(updatedProduct)
  );

  await updateDoc(GLOBALS.COLLECTION.PRODUCTS, productId, updatedProduct);
  dispatch({ type: 'update_product' });
};

const deleteProduct = (dispatch) => async ({ productId }) => {
  dispatch({ type: 'loading' });
  console.log('Deleting product with id: ' + productId);

  await deleteDoc(GLOBALS.COLLECTION.PRODUCTS, productId);
  dispatch({ type: 'delete_product' });
};

export const { Provider, Context } = createDataContext(
  productReducer,
  {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  },
  { products: null, loading: false }
);
