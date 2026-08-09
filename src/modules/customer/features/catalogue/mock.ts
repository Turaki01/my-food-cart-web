import type { Product } from '@shared/types'

export interface MockProduct extends Product {
  hint: string // placeholder label shown in image area
}

const store1: MockProduct[] = [
  // Yam & Flours
  { id: 'p1',  storeId: '1', name: 'Pounded Yam Flour',     price:  299, unit: '1.5kg',     category: 'Yam & Flours',  inStock: true,  hint: 'yam flour'   },
  { id: 'p2',  storeId: '1', name: 'Garri (Ijebu)',          price:  349, unit: '1kg',       category: 'Yam & Flours',  inStock: true,  hint: 'garri'       },
  { id: 'p3',  storeId: '1', name: 'Semovita',               price:  499, unit: '2kg',       category: 'Yam & Flours',  inStock: false, hint: 'semovita'    },
  { id: 'p4',  storeId: '1', name: 'Fufu Mix',               price:  249, unit: '900g',      category: 'Yam & Flours',  inStock: true,  hint: 'fufu'        },

  // Fresh Produce
  { id: 'p5',  storeId: '1', name: 'Ripe Plantain',          price:  199, unit: 'pack of 4', category: 'Fresh Produce', inStock: true,  hint: 'plantain'    },
  { id: 'p6',  storeId: '1', name: 'Scotch Bonnet Peppers',  price:  129, unit: '100g',      category: 'Fresh Produce', inStock: true,  hint: 'peppers'     },
  { id: 'p7',  storeId: '1', name: 'Fresh Okra',             price:  249, unit: '400g',      category: 'Fresh Produce', inStock: true,  hint: 'okra'        },
  { id: 'p8',  storeId: '1', name: 'Ugu (Fluted Pumpkin)',   price:  279, unit: 'bunch',     category: 'Fresh Produce', inStock: true,  hint: 'ugu'         },
  { id: 'p9',  storeId: '1', name: 'Bitter Leaf',            price:  199, unit: 'bunch',     category: 'Fresh Produce', inStock: false, hint: 'bitter leaf' },

  // Frozen
  { id: 'p10', storeId: '1', name: 'Goat Meat (Bone-in)',    price:  899, unit: 'per kg',    category: 'Frozen',        inStock: true,  hint: 'goat meat'   },
  { id: 'p11', storeId: '1', name: 'Whole Tilapia',          price:  749, unit: '2 fish',    category: 'Frozen',        inStock: true,  hint: 'tilapia'     },
  { id: 'p12', storeId: '1', name: 'Stockfish (Dry)',        price: 1299, unit: 'pack',      category: 'Frozen',        inStock: true,  hint: 'stockfish'   },

  // Condiments
  { id: 'p13', storeId: '1', name: 'Red Palm Oil',           price:  499, unit: '1L',        category: 'Condiments',    inStock: true,  hint: 'palm oil'    },
  { id: 'p14', storeId: '1', name: 'Long Grain Rice',        price:  899, unit: '5kg',       category: 'Condiments',    inStock: true,  hint: 'rice'        },
  { id: 'p15', storeId: '1', name: 'Egusi (Ground)',         price:  399, unit: '500g',      category: 'Condiments',    inStock: true,  hint: 'egusi'       },
  { id: 'p16', storeId: '1', name: 'Dried Crayfish',         price:  549, unit: '200g',      category: 'Condiments',    inStock: false, hint: 'crayfish'    },
]

const store2: MockProduct[] = [
  { id: 'p20', storeId: '2', name: 'Jollof Rice Mix',        price:  349, unit: '800g',      category: 'Grains & Staples', inStock: true,  hint: 'rice mix'   },
  { id: 'p21', storeId: '2', name: 'Suya Spice',             price:  299, unit: '100g',      category: 'Condiments',       inStock: true,  hint: 'suya spice' },
  { id: 'p22', storeId: '2', name: 'Coconut Oil (Raw)',      price:  699, unit: '500ml',     category: 'Condiments',       inStock: true,  hint: 'coconut oil'},
  { id: 'p23', storeId: '2', name: 'Green Plantain',         price:  179, unit: 'each',      category: 'Fresh Produce',    inStock: true,  hint: 'plantain'   },
]

export const MOCK_PRODUCTS: Record<string, MockProduct[]> = {
  '1': store1,
  '2': store2,
}

export function getCategories(storeId: string): string[] {
  const products = MOCK_PRODUCTS[storeId] ?? []
  return [...new Set(products.map(p => p.category))]
}
