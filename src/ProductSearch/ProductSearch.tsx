import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

// --- TYPE DEFINITIONS ---
interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: number;
  categoryId?: string; // Assuming products have a category ID
  brand?: string; // Assuming products have a brand
  img: string;
}

interface Category {
  id: string;
  name: string;
  children?: Category[];
}

interface Filters {
  price: [number, number];
  mainCategory: string | null;
  category: string | null;
  subCategory: string | null;
  brands: Brand[];
}

interface Brand {
  id: string;
  name: string;
}

// --- MOCK DATA ---
let mockProducts: Product[] = [
  { id: 1, name: 'Rathna Exercise Book 200 Pages Square Ruled', price: '192.00', oldPrice: '248.00', discount: 23, img: 'https://placehold.co/224x192/f9f9f9/333?text=Book' },
  { id: 2, name: 'Rathna Exercise Book 160 Pages Single Ruled', price: '160.00', oldPrice: '200.00', discount: 20, img: 'https://placehold.co/224x192/f9f9f9/333?text=Book' },
];

let mockCategories: Category[] = [
  {
    id: 'main1', name: 'Stationery', children: [
      { id: 'sub1', name: 'Books', children: [{ id: 'subsub1', name: 'Square Ruled' }, { id: 'subsub2', name: 'Single Ruled' }] },
      { id: 'sub2', name: 'Drawing Books', children: [] },
    ],
  },
  {
    id: 'main2', name: 'Writing & Drawing', children: [
      { id: 'sub3', name: 'Pens & Pencils', children: [{ id: 'subsub3', name: 'Pencils' }] },
      { id: 'sub4', name: 'Art Supplies', children: [{ id: 'subsub4', name: 'Water Colors' }] },
    ],
  },
  { id: 'main3', name: 'Printers & Scanners', children: [] }
];

let mockBrands: Brand[] = [
  { id: '1', name: 'Rathna' },
  { id: '2', name: 'Promate' },
  { id: '3', name: 'Mungo' },
  { id: '4', name: 'Platignum' },
  { id: '5', name: 'Epson' },
  { id: '6', name: 'HP' },
  { id: '7', name: 'Canon' }
];
const PRODUCTS_PER_PAGE: number = 10;
const MIN_PRICE: number = 0;
const MAX_PRICE: number = 1000000;

// --- HELPER & SUB-COMPONENTS ---

interface PriceFilterProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, setPriceRange }) => {
  const [minVal, setMinVal] = useState<number>(priceRange[0]);
  const [maxVal, setMaxVal] = useState<number>(priceRange[1]);
  const range = useRef<HTMLDivElement>(null);

  // Set range bar width and position
  useEffect(() => {
    if (range.current) {
      const minPercent = ((minVal - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      const maxPercent = ((maxVal - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal]);

  // Set final price range in parent component on mouse up
  const onMouseUp = () => setPriceRange([minVal, maxVal]);

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold mb-4 text-sm text-gray-800 tracking-wide">BY PRICE</h3>
      <div className="relative h-8 flex items-center">
        {/* Min value slider */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={minVal}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.min(Number(event.target.value), maxVal - 100);
            setMinVal(value);
          }}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          className="thumb z-10" // z-10 to ensure min thumb is above max thumb
        />

        {/* The visual track and selected range */}
        <div className="relative w-full">
          <div className="absolute w-full h-1 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
          <div ref={range} className="absolute h-1 bg-blue-500 rounded-full top-1/2 -translate-y-1/2"></div>
        </div>

        {/* Max value slider */}
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={maxVal}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(Number(event.target.value), minVal + 100);
            setMaxVal(value);
          }}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          className="thumb"
        />

      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>LKR {minVal.toLocaleString()}</span>
        <span>LKR {maxVal.toLocaleString()}</span>
      </div>
    </div>
  );
};

interface CategoryItemProps {
  category: Category;
  selectedMain: string | null;
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  handleCategorySelect: (mainId: string, categoryId?: string, subId?: string) => void;
  mainId?: string;
  categoryId?: string;
  level?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  selectedMain,
  selectedCategory,
  selectedSubCategory,
  handleCategorySelect,
  mainId,
  categoryId,
  level = 0
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Determine which radio is selected
  let isSelected = false;
  if (level === 0) isSelected = selectedMain === category.id;
  else if (level === 1) isSelected = selectedCategory === category.id;
  else if (level === 2) isSelected = selectedSubCategory === category.id;

  // Handle selection
  const onSelect = () => {
    if (level === 0) handleCategorySelect(category.id, undefined, undefined);
    else if (level === 1 && mainId) handleCategorySelect(mainId, category.id, undefined);
    else if (level === 2 && mainId && categoryId) handleCategorySelect(mainId, categoryId, category.id);
  };

  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      <div className="flex items-center my-2">
        {category.children && category.children.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)} className="mr-2 text-gray-400 hover:text-gray-800 w-5 h-5 flex items-center justify-center">
            {isOpen ? '−' : '+'}
          </button>
        )}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="category"
            checked={isSelected}
            onChange={onSelect}
            className="form-radio min-w-4 min-h-4 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className={`text-sm ${isSelected ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{category.name}</span>
        </label>
      </div>
      {isOpen && category.children && category.children.length > 0 && (
        <div>
          {category.children.map(child => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedMain={selectedMain}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              handleCategorySelect={handleCategorySelect}
              mainId={level === 0 ? category.id : mainId}
              categoryId={level === 1 ? category.id : categoryId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryFilterProps {
  categories: Category[];
  filters: Filters;
  handleCategorySelect: (mainId: string, categoryId?: string, subId?: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, filters, handleCategorySelect }) => (
  <div className="p-4 border-b border-gray-200">
    <h3 className="font-semibold mb-2 text-sm text-gray-800 tracking-wide">PRODUCT CATEGORIES</h3>
    {categories.map(main => (
      <CategoryItem
        key={main.id}
        category={main}
        selectedMain={filters.mainCategory}
        selectedCategory={filters.category}
        selectedSubCategory={filters.subCategory}
        handleCategorySelect={handleCategorySelect}
        level={0}
      />
    ))}
  </div>
);

interface BrandFilterProps {
  brands: Brand[];
  selectedBrands: Brand[];
  setSelectedBrands: (brands: Brand[]) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({ brands, selectedBrands, setSelectedBrands }) => {
  const handleBrandChange = (brand: Brand) => {
    const exists = selectedBrands.some(b => b.id === brand.id);
    const newSelectedBrands = exists
      ? selectedBrands.filter(b => b.id !== brand.id)
      : [...selectedBrands, brand];
    setSelectedBrands(newSelectedBrands);
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2 text-sm text-gray-800 tracking-wide">BY BRANDS</h3>
      <div className="space-y-2">
        {brands
          .filter(brand => brand.id && brand.name)
          .map((brand) => (
            <label key={`${brand.id}-${brand.name}`} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.some(b => b.id === brand.id)}
                onChange={() => handleBrandChange(brand)}
                className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{brand.name}</span>
            </label>
          ))}
      </div>
    </div>
  );
};

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  clearAllFilters: () => void;
  handleCategorySelect: (mainId: string, categoryId?: string, subId?: string) => void;
  categories: Category[];
  brands: Brand[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  clearAllFilters,
  handleCategorySelect,
  categories,
  brands
}) => (
  <aside className="w-full md:w-1/4 lg:w-1/5 bg-white border-r border-gray-200 rounded-lg shadow-sm">
    <div className="p-4 flex justify-between items-center border-b border-gray-200">
      <h2 className="text-md font-bold text-gray-800">FILTERS</h2>
      <button onClick={clearAllFilters} className="text-xs text-blue-500 hover:underline">Clear All</button>
    </div>
    <PriceFilter priceRange={filters.price} setPriceRange={(price) => setFilters(prev => ({ ...prev, price }))} />

    {/* Use the 'categories' prop here */}
    <CategoryFilter categories={categories} filters={filters} handleCategorySelect={handleCategorySelect} />

    {/* Use the 'brands' prop here to fix the bug */}
    <BrandFilter
      brands={brands}
      selectedBrands={filters.brands}
      setSelectedBrands={(brands) => setFilters(prev => ({ ...prev, brands }))}
    />
  </aside>
);

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const kokopayLogoUrl = 'https://www.promateworld.com/images/koko.png'; // Placeholder logo


  //addtoCart function

  const addToCart = async (productId: string, qty: number) => {

    try {
      const response = await fetch(`${TECHMART_BASE_URL}/AddToCart?id=${productId}&qty=${qty}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
        }
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log(json.message);
          toast.success(json.message);
        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("AddToCart failed. Please try again");
        toast.error("AddToCart failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("AddToCart Error:", error);
    }
  };

  //addtoCart function

  return (
    <a href={`/singleproduct?id=${product.id}`} className="block">
      <div className="flex-shrink-0 w-full text-left group p-2 rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-lg border">
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <img src={product.img} alt={product.name} className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105" />
          </div>
          {product.discount && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{product.discount}%</div>
          )}
          <div className="absolute inset-0">
            <a href="#" onClick={(e) => e.preventDefault()} className="absolute inset-0">
              <button onClick={() => addToCart(String(product.id), 1)} className="absolute bottom-2 right-2 bg-lime-500 text-white p-2 rounded-full hover:bg-lime-600 transition-colors">
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
            </a>
          </div>
        </div>
        <h4 className="font-medium text-gray-800 mt-3 text-base h-12 overflow-hidden">{product.name}</h4>
        <div className="flex items-baseline space-x-2 mt-2">
          <p className="text-red-600 text-lg font-bold">LKR {product.price}</p>
          {product.oldPrice && (
            <p className="text-gray-500 line-through text-sm">LKR {product.oldPrice}</p>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1 h-8">
          {!isNaN(parseFloat(product.price)) && (
            <>
              <span>LKR {(parseFloat(product.price.replace(/,/g, '')) / 3).toFixed(2)} X 3 with </span>
              <img src={kokopayLogoUrl} alt="mintpay" className="h-3 inline-block" />
            </>
          )}
        </div>
      </div>
    </a>
  );
};

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) return <div className="text-center py-20 text-gray-500 col-span-full"><h3>No products found matching your criteria.</h3><p>Try adjusting your filters.</p></div>;
  return <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-2">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const NavButton: React.FC<{ children: React.ReactNode; onClick: () => void; disabled: boolean; }> = ({ children, onClick, disabled }) => (<button onClick={onClick} disabled={disabled} className="h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{children}</button>);
  const PageNumber: React.FC<{ number: number; isActive: boolean; }> = ({ number, isActive }) => (<button onClick={() => onPageChange(number)} className={`h-9 w-9 flex items-center justify-center rounded-full border transition-colors ${isActive ? 'bg-blue-500 text-white border-blue-500 font-bold' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{number}</button>);
  return (
    <nav className="flex justify-center items-center space-x-2 mt-10">
      <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></NavButton>
      {pageNumbers.map((number) => <PageNumber key={number} number={number} isActive={currentPage === number} />)}
      <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></NavButton>
    </nav>
  );
};

// --- MAIN COMPONENT ---
const ProductSearch: React.FC = () => {
  const initialFilters: Filters = {
    price: [MIN_PRICE, MAX_PRICE],
    mainCategory: null,
    category: null,
    subCategory: null,
    brands: []
  };
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('default');
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [brands, setBrands] = useState<Brand[]>(mockBrands);

  // useEffect(() => {
  //   let result: Product[] = [...products];
  //   result = result.filter(p => parseFloat(p.price) >= filters.price[0] && parseFloat(p.price) <= filters.price[1]);
  //   if (filters.brands.length > 0) result = result.filter(p => p.brand && filters.brands.includes(p.brand));
  //   if (filters.category) {
  //     const categoryIdsToMatch = getAllChildCategoryIds(filters.category, mockCategories);
  //     result = result.filter(p => p.categoryId && categoryIdsToMatch.includes(p.categoryId));
  //   }

  //   switch (sortBy) {

  //     case 'discount-desc': result.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0)); break;
  //     case 'price-asc': result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
  //     case 'price-desc': result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
  //     case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
  //     case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
  //     default: result.sort((a, b) => a.id - b.id); break;
  //   }

  //   setFilteredProducts(result);
  //   setCurrentPage(1);
  // }, [filters, sortBy, products]);\\

  useEffect(() => {
    searchProducts();
    setCurrentPage(1);
  }, [filters, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  //loadSearchDetails function

  const loadSearchDetails = async () => {

    try {
      const response = await fetch(`${TECHMART_BASE_URL}/loadSearchDetails`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
        }
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log(json);

          // Correctly format and set categories state
          const fetchedCategories = json.searchDetails.map((main: any) => ({
            id: main.mainCategory.id,
            name: main.mainCategory.name,
            children: main.categories.map((sub: any) => ({
              id: sub.category.id,
              name: sub.category.name,
              children: sub.subCategories.map((subsub: any) => ({
                id: subsub.id,
                name: subsub.name
              }))
            }))
          }));
          setCategories(fetchedCategories); // <-- Use state setter

          // Correctly format and set brands state
          const fetchedBrands = json.brandList.map((b: any) => ({
            id: b.id,
            name: b.name
          }));
          setBrands(fetchedBrands); // <-- Use state setter

        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("loadSearchDetails failed. Please try again");
        toast.error("loadSearchDetails failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("loadSearchDetails Error:", error);
    }
  };

  //loadSearchDetails function

  //search products

  const searchProducts = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    let findText = searchParams.get('find');

    if (!findText) {
      findText = '';
    }

    const search = {
      findText: findText,
      minPrice: filters.price[0],
      maxPrice: filters.price[1],
      mainCategoryId: filters.mainCategory || "",
      categoryId: filters.category || "",
      subCategoryId: filters.subCategory || "",
      brands: filters.brands.map(b => ({ id: b.id, name: b.name })),
      sortBy,
    };
    console.log(search);
    try {
      const response = await fetch(`${TECHMART_BASE_URL}/SearchProducts`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify(search)
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status) {
          console.log(json);
          const backendProducts = json.stockList.map((item: any) => ({
            id: item.product.id,
            name: item.product.title,
            price: item.price.toFixed(2),
            oldPrice: (item.price * 100 / (100 - item.product.discount)).toFixed(2),
            discount: item.product.discount,
            img: `http://localhost:8080/techmart/product-images/${item.product.id}/image1.png`
          }));
          setProducts(backendProducts); // <-- update state here
          setFilteredProducts(backendProducts);
        } else {
          if (json.message == "Products Not Found !") {
            setFilteredProducts([]);
          }
          toast.error(json.message);
        }
      } else {
        toast.error("SearchProducts failed. Please try again");
      }
    } catch (error) {
      toast.error("Internal Server Error. Please try again later");
      console.error("SearchProducts Error:", error);
    }
  };

  useEffect(() => {
    loadSearchDetails();
    searchProducts();
  }, []);

  //search products

  const handleCategorySelect = (
    mainId: string,
    categoryId?: string,
    subId?: string
  ) => {
    setFilters(prev => ({
      ...prev,
      mainCategory: mainId || null,
      category: categoryId || null,
      subCategory: subId || null
    }));
  };

  return (
    <>
      <style>{`
        .thumb {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          transform: translateY(-50%);
          height: 16px; /* Height for the clickable area */
        }
        .thumb::-webkit-slider-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #3b82f6;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          cursor: pointer;
          -webkit-appearance: none;
        }
        .thumb::-moz-range-thumb {
          pointer-events: all;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #3b82f6;
          border: 2px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          cursor: pointer;
          -moz-appearance: none;
        }
      `}</style>
      <div className="bg-gray-50 font-sans pt-30">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row gap-6">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              clearAllFilters={() => {
                setFilters(initialFilters);
                setSortBy('default');
                window.location.href = `/product/search?find=`
              }}
              handleCategorySelect={handleCategorySelect}
              categories={categories}
              brands={brands}
            />
            <main className="flex-1">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold">{startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)}</span> of <span className="font-bold">{filteredProducts.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                  <select id="sort" value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1">
                    <option value="default">Default</option>
                    <option value="discount-desc">Discount: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                  </select>
                </div>
              </div>
              <ProductGrid products={currentProducts} />
              {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSearch;
