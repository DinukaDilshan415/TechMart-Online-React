import { useEffect } from "react"


const MainNav = () => {

    useEffect(() => {
        const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
        const megaMenus = document.querySelectorAll('#productMegaMenu, #brandMegaMenu');
        const productCategoryItems = document.querySelectorAll('#productCategoryMenu .category-item');
        const brandCategoryItems = document.querySelectorAll('#brandCategoryMenu .brand-item');
        const productSubmenus = document.querySelectorAll('#productMegaMenu .submenu');
        const brandSubmenus = document.querySelectorAll('#brandMegaMenu .submenu');

        // Function to close all dropdowns
        function closeAllMenus() {
            megaMenus.forEach(menu => {
                menu.classList.remove('active');
            });
        }

        // Function to activate a category
        function activateCategory(item: Element, allItems: NodeListOf<Element>, allSubmenus: NodeListOf<Element>) {
            allItems.forEach(item => {
                item.classList.remove('active');
            });

            item.classList.add('active');

            allSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });

            let categoryId: string | null = null;
            if (item.classList.contains('category-item')) {
                categoryId = item.getAttribute('data-category');
            } else if (item.classList.contains('brand-item')) {
                categoryId = item.getAttribute('data-brand');
            }

            if (categoryId) {
                const targetSubmenu = document.getElementById(categoryId);
                if (targetSubmenu) {
                    targetSubmenu.classList.add('active');
                }
            }
        }

        // Add event listeners to dropdown triggers
        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLElement;
                const targetId = target.getAttribute('data-target');
                if (!targetId) return;
                const targetMenu = document.getElementById(targetId);
                if (!targetMenu) return;

                closeAllMenus();
                targetMenu.classList.toggle('active');

                if (targetMenu.classList.contains('active')) {
                    if (targetId === 'productMegaMenu') {
                        const firstCategory = document.querySelector('#productCategoryMenu .category-item') as HTMLElement | null;
                        if (firstCategory) {
                            activateCategory(firstCategory, productCategoryItems, productSubmenus);
                        }
                    } else if (targetId === 'brandMegaMenu') {
                        const firstBrand = document.querySelector('#brandCategoryMenu .brand-item') as HTMLElement | null;
                        if (firstBrand) {
                            activateCategory(firstBrand, brandCategoryItems, brandSubmenus);
                        }
                    }
                }
            });

            trigger.addEventListener('mouseenter', (e) => {
                const target = e.currentTarget as HTMLElement;
                const targetId = target.getAttribute('data-target');
                if (!targetId) return;
                const targetMenu = document.getElementById(targetId);
                if (!targetMenu) return;

                closeAllMenus();
                targetMenu.classList.add('active');

                if (targetId === 'productMegaMenu') {
                    const firstCategory = document.querySelector('#productCategoryMenu .category-item') as HTMLElement | null;
                    if (firstCategory) {
                        activateCategory(firstCategory, productCategoryItems, productSubmenus);
                    }
                } else if (targetId === 'brandMegaMenu') {
                    const firstBrand = document.querySelector('#brandCategoryMenu .brand-item') as HTMLElement | null;
                    if (firstBrand) {
                        activateCategory(firstBrand, brandCategoryItems, brandSubmenus);
                    }
                }
            });
        });


        // Add event listeners to megaMenus
        megaMenus.forEach(menu => {
            menu.addEventListener('mouseleave', closeAllMenus);
        });

        // Add event listeners to product category items
        productCategoryItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                activateCategory(item, productCategoryItems, productSubmenus);
            });

            item.addEventListener('mouseenter', function () {
                activateCategory(item, productCategoryItems, productSubmenus);
            });
        });

        // Add event listeners to brand category items
        brandCategoryItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                activateCategory(item, brandCategoryItems, brandSubmenus);
            });

            item.addEventListener('mouseenter', function () {
                activateCategory(item, brandCategoryItems, brandSubmenus);
            });
        });

        // Close dropdowns when clicking outside
        function handleDocumentClick(e: MouseEvent) {
            const isClickInsideMenu = Array.from(megaMenus).some(menu => menu.contains(e.target as Node));
            const isClickOnTrigger = Array.from(dropdownTriggers).some(trigger => trigger.contains(e.target as Node));

            if (!isClickInsideMenu && !isClickOnTrigger) {
                closeAllMenus();
            }
        }

        document.addEventListener('click', handleDocumentClick);

        // Cleanup event listeners on unmount
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };

    }, []); // Empty dependency array => runs once when mounted

    return (
        <>
            <main className="pt-20">
                {/* <!-- Main Navigation --> */}
                <nav className="bg-edumartPrimary">
                    <div className="container mx-auto px-4">
                        <ul className="flex">
                            <li className="relative">
                                <a href="#" className="dropdown-trigger text-white py-4 px-6 hover:bg-lime-600 flex items-center" data-target="productMegaMenu">
                                    Products
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                            </li>
                            <li className="relative">
                                <a href="#" className="dropdown-trigger text-white py-4 px-6 hover:bg-lime-600 flex items-center" data-target="brandMegaMenu">
                                    Brands
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                            </li>
                            <li><a href="#" className="text-white block py-4 px-6 hover:bg-lime-600">About us</a></li>
                            <li><a href="#" className="text-white block py-4 px-6 hover:bg-lime-600">FAQs</a></li>
                            <li><a href="#" className="text-white block py-4 px-6 hover:bg-lime-600">Contact Us</a></li>
                            <li><a href="#" className="text-white block py-4 px-6 hover:bg-lime-600">Compare</a></li>
                            <li><a href="#" className="text-white block py-4 px-6 hover:bg-lime-600">Blog</a></li>
                        </ul>
                    </div>
                </nav>

                {/* <!-- Products Mega Menu Container --> */}
                <div id="productMegaMenu" className="container mx-auto shadow-md">
                    <div className="flex">
                        {/* <!-- Left sidebar menu --> */}
                        <div className="w-64 bg-white border-r border-gray-200">
                            <ul id="productCategoryMenu">
                                <li className="category-item border-b border-gray-100" data-category="laptops">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-yellow-700 mr-2">💻</span>
                                        Laptops
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="computer-parts">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-blue-500 mr-2">🖥</span>
                                        Computer Parts
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="mobile-stuff">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-gray-500 mr-2">📱</span>
                                        Mobile Stuff
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="audio-products">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-lime-600 mr-2">🎧</span>
                                        Audio Products
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="pc-laptop-accessories">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-amber-500 mr-2">🖱</span>
                                        PC & Laptop Accessories
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="home-appliances">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-indigo-500 mr-2">📺</span>
                                        PC & Laptop Accessories
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="smartwatch">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-pink-500 mr-2">⌚</span>
                                        Smartwatch
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="category-item border-b border-gray-100" data-category="office-stuff">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-green-500 mr-2">🖨</span>
                                        Office Stuff
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                {/* <!-- More categories as needed --> */}
                            </ul>
                        </div>

                        {/* <!-- Right expanded submenu content --> */}
                        <div className="flex-1 bg-white p-6">
      
                            <div id="laptops" className="submenu">
                                <div className="grid grid-cols-3 gap-8 w-full">
                                    {/* <!-- Column 1 --> */}
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Ultrabooks & Thin-and-Lights</h3>
                                        <ul className="space-y-2">
                                            {/* <li><a href="#" className="text-gray-700 hover:text-lime-600">Ball Pens</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Gel Pens</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Colouring Pens</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Other Pens</a></li> */}
                                        </ul>
                                    </div>

                                    {/* <!-- Column 2 --> */}
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Business & Enterprise Laptops</h3>
                                        <ul className="space-y-2">
                                            {/* <li><a href="#" className="text-gray-700 hover:text-lime-600">Chisel Narrow Tip</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Chisel Tip</a></li> */}
                                        </ul>
                                    </div>

                                    {/* <!-- Column 3 --> */}
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Gaming Laptops</h3>
                                        <ul className="space-y-2">
                                            {/* <li><a href="#" className="text-gray-700 hover:text-lime-600">Permanent Markers</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Whiteboard Markers</a></li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div id="computer-parts" className="submenu">
                                <div className="grid grid-cols-3 gap-8 w-full">
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Monitors</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Everyday/Office Monitors</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Gaming Monitors</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Professional/Creator Monitors</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">IPS</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">VA</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">TN</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">OLED</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Computer Cases</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Mini Tower / Small Form Factor</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Mid Tower</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Full Tower</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">RAM (Memory)</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">DDR3</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">DDR4</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">DDR5</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- More submenus for other categories --> */}
                        </div>
                    </div>
                </div>

                {/* <!-- Brands Mega Menu Container --> */}
                <div id="brandMegaMenu" className="container mx-auto shadow-md">
                    <div className="flex">
                        {/* <!-- Left sidebar menu --> */}
                        <div className="w-64 bg-white border-r border-gray-200">
                            <ul id="brandCategoryMenu">
                                <li className="brand-item border-b border-gray-100" data-brand="apple">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-green-700 mr-2">
                                            <img className="w-10 h-10" src="https://n5su3bze2ea.b-cdn.net/brands/vb9o9fr26xe.png?width=256&height=256&aspect_ratio=256%3A256" alt="" />
                                        </span>
                                        Apple
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="brand-item border-b border-gray-100" data-brand="samsung">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-blue-500 mr-2">
                                            <img className="w-10 h-10" src="https://www.htbrandstudio.com/wp-content/uploads/2020/10/samsung-group-vector-logo-200x200.png" alt="" />
                                        </span>
                                        Samsung
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="brand-item border-b border-gray-100" data-brand="google">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-yellow-500 mr-2">
                                            <img className="w-10 h-10" src="https://cdn-1.webcatalog.io/catalog/google/google-icon-filled-256.png?v=1779064311044" alt="" />
                                        </span>
                                        Google
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="brand-item border-b border-gray-100" data-brand="haylou">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-red-500 mr-2">
                                            <img className="w-10 h-10" src="https://cdn.brandfetch.io/haylou.com/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed" alt="" />
                                        </span>
                                        Haylou
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="brand-item border-b border-gray-100" data-brand="jbl">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-purple-500 mr-2">
                                            <img className="w-10 h-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdesKjowJUQEDK7g6s_PaYyWH3lxaPqTyFPQ&s" alt="" />
                                        </span>
                                        JBL
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="brand-item border-b border-gray-100" data-brand="xiaomi">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-indigo-500 mr-2">
                                            <img className="w-10 h-10" src="https://images.seeklogo.com/logo-png/40/2/xiaomi-new-2021-logo-png_seeklogo-400999.png" alt="" />
                                        </span>
                                        Xiaomi
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                                <li className="brand-item border-b border-gray-100" data-brand="anker">
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-100">
                                        <span className="text-amber-500 mr-2">
                                            <img className="w-10 h-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT539ZUntILmeP0yq9MA330vo2InuVqGpLm-A&s" alt="" />
                                        </span>
                                        Anker
                                        <span className="ml-auto text-gray-400">›</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* <!-- Right expanded submenu content --> */}
                        <div className="flex-1 bg-white p-6">
                            {/* <!-- Rathna Submenu --> */}
                            <div id="apple" className="submenu">
                                <div className="grid grid-cols-4 gap-6 w-full">
                                    <div className="col-span-4">
                                        <div className="flex items-center mb-6">
                                            <img className="mr-4 w-20 h-20" src="https://static.vecteezy.com/system/resources/thumbnails/019/136/440/small/apple-logo-apple-icon-free-free-vector.jpg" alt="Rathna Logo"/>
                                            <h2 className="text-xl font-bold">Apple Products</h2>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">iPhone</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPhone 17</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPhone 17 Pro</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPhone Air</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPhone 16</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Mac</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">MacBook Air</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">MacBook Pro</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Mac mini</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">iPad</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPad mini</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPad Air</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">iPad Pro</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Apple Watch</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Series 11</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- ProMate Submenu --> */}
                            <div id="samsung" className="submenu">
                                <div className="grid grid-cols-3 gap-8 w-full">
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Mobile Devices & Wearables</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Galaxy S Series</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Galaxy Z Series</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Galaxy A & M Series</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Galaxy Watch & Buds</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Galaxy Tab</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Home Appliances</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Kitchen</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Laundry</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Climate</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-4">Home Entertainment</h3>
                                        <ul className="space-y-2">
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">TVs</a></li>
                                            <li><a href="#" className="text-gray-700 hover:text-lime-600">Audio</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Other brand submenus will be added here --> */}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default MainNav