-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.32 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for techmart_online
CREATE DATABASE IF NOT EXISTS `techmart_online` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `techmart_online`;

-- Dumping structure for table techmart_online.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(20) NOT NULL,
  `verification_code` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `admin_role_id` int NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_admin_status1_idx` (`status_id`),
  KEY `fk_admin_admin_role1_idx` (`admin_role_id`),
  CONSTRAINT `fk_admin_admin_role1` FOREIGN KEY (`admin_role_id`) REFERENCES `admin_role` (`id`),
  CONSTRAINT `fk_admin_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.admin: ~1 rows (approximately)
REPLACE INTO `admin` (`id`, `username`, `email`, `password`, `verification_code`, `created_at`, `admin_role_id`, `status_id`) VALUES
	(1, 'Dinuka', 'dinuka@tm.com', 'Dinuka@1234', 'Verified', '2026-06-19 02:03:18', 1, 1);

-- Dumping structure for table techmart_online.admin_role
CREATE TABLE IF NOT EXISTS `admin_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.admin_role: ~2 rows (approximately)
REPLACE INTO `admin_role` (`id`, `value`) VALUES
	(1, 'Admin'),
	(2, 'Moderator');

-- Dumping structure for table techmart_online.brand
CREATE TABLE IF NOT EXISTS `brand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.brand: ~10 rows (approximately)
REPLACE INTO `brand` (`id`, `name`) VALUES
	(1, 'Apple'),
	(2, 'Samsung'),
	(3, 'Xiaomi'),
	(4, 'Anker'),
	(5, 'JBL'),
	(6, 'ASUS'),
	(7, 'MSI'),
	(8, 'Haylou'),
	(9, 'Google'),
	(10, 'Lenovo');

-- Dumping structure for table techmart_online.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `product_id` int NOT NULL,
  `stock_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_product1_idx` (`product_id`),
  KEY `fk_cart_user1_idx` (`user_id`),
  KEY `fk_cart_stock1_idx` (`stock_id`),
  CONSTRAINT `fk_cart_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_cart_stock1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`),
  CONSTRAINT `fk_cart_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.cart: ~0 rows (approximately)

-- Dumping structure for table techmart_online.category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `main_category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category_main_category1_idx` (`main_category_id`),
  CONSTRAINT `fk_category_main_category1` FOREIGN KEY (`main_category_id`) REFERENCES `main_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.category: ~12 rows (approximately)
REPLACE INTO `category` (`id`, `name`, `main_category_id`) VALUES
	(1, 'Mobile Phones', 1),
	(2, 'Laptops', 2),
	(3, 'Smart Watches', 3),
	(4, 'Ultrabooks & Thin-and-Lights', 2),
	(5, 'Business & Enterprise Laptops', 2),
	(6, 'Gaming Laptops', 2),
	(7, 'Monitors', 4),
	(8, 'Computer Cases', 4),
	(9, 'RAM', 4),
	(10, 'Headphones & Headsets', 5),
	(11, 'Speakers', 5),
	(12, 'Microphones', 5);

-- Dumping structure for table techmart_online.city
CREATE TABLE IF NOT EXISTS `city` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.city: ~9 rows (approximately)
REPLACE INTO `city` (`id`, `name`) VALUES
	(1, 'Kandy'),
	(2, 'Nawalapitiya'),
	(3, 'Colombo'),
	(4, 'Gampaha'),
	(5, 'Moratuwa'),
	(6, 'Ja-ela'),
	(7, 'Dambulla'),
	(8, 'Matale'),
	(9, 'Gampola');

-- Dumping structure for table techmart_online.gift_address
CREATE TABLE IF NOT EXISTS `gift_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(45) NOT NULL,
  `address` text NOT NULL,
  `note` text NOT NULL,
  `postal_code` varchar(5) NOT NULL,
  `city_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gift_address_city1_idx` (`city_id`),
  CONSTRAINT `fk_gift_address_city1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.gift_address: ~2 rows (approximately)
REPLACE INTO `gift_address` (`id`, `full_name`, `address`, `note`, `postal_code`, `city_id`) VALUES
	(1, 'Dinuka Dilshan', 'No. 4/a Aluthgama, Dekinda, Nawalapitiya.', 'Wrap in red', '20650', 2),
	(2, 'Dinuka Dilshan', 'No. 4/a Aluthgama, Dekinda, Nawalapitiya.', 'Nothing', '20650', 2);

-- Dumping structure for table techmart_online.invoice
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(45) CHARACTER SET utf8mb3 NOT NULL,
  `created_at` datetime NOT NULL,
  `amount` double NOT NULL,
  `order_status_id` int NOT NULL,
  `user_id` int NOT NULL,
  `user_address_id` int NOT NULL,
  `gift_address_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_invoice_order_status1_idx` (`order_status_id`),
  KEY `fk_invoice_user1_idx` (`user_id`),
  KEY `fk_invoice_user_address1_idx` (`user_address_id`),
  KEY `fk_invoice_gift_address1_idx` (`gift_address_id`),
  CONSTRAINT `fk_invoice_gift_address1` FOREIGN KEY (`gift_address_id`) REFERENCES `gift_address` (`id`),
  CONSTRAINT `fk_invoice_order_status1` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`id`),
  CONSTRAINT `fk_invoice_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_invoice_user_address1` FOREIGN KEY (`user_address_id`) REFERENCES `user_address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_mysql500_ci;

-- Dumping data for table techmart_online.invoice: ~4 rows (approximately)
REPLACE INTO `invoice` (`id`, `order_id`, `created_at`, `amount`, `order_status_id`, `user_id`, `user_address_id`, `gift_address_id`) VALUES
	(1, '#0001', '2026-06-24 02:28:39', 21897, 1, 1, 1, NULL),
	(2, '#0002', '2026-06-26 02:33:47', 19499, 1, 2, 2, NULL),
	(3, '#0003', '2026-06-26 02:34:59', 250400, 1, 2, 2, 2),
	(4, '#0004', '2026-06-26 02:39:10', 382499, 1, 3, 3, NULL);

-- Dumping structure for table techmart_online.invoice_items
CREATE TABLE IF NOT EXISTS `invoice_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` int NOT NULL,
  `qty` int NOT NULL,
  `stock_id` int NOT NULL,
  `ratings_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_invoice_items_stock1_idx` (`stock_id`),
  KEY `fk_invoice_items_ratings1_idx` (`ratings_id`),
  KEY `fk_invoice_items_invoice1_idx` (`invoice_id`),
  CONSTRAINT `fk_invoice_items_invoice1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`),
  CONSTRAINT `fk_invoice_items_ratings1` FOREIGN KEY (`ratings_id`) REFERENCES `ratings` (`id`),
  CONSTRAINT `fk_invoice_items_stock1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.invoice_items: ~7 rows (approximately)
REPLACE INTO `invoice_items` (`id`, `invoice_id`, `qty`, `stock_id`, `ratings_id`) VALUES
	(1, 1, 1, 10, 2),
	(2, 1, 2, 1, 2),
	(3, 2, 1, 12, 2),
	(4, 3, 1, 2, 2),
	(5, 4, 1, 4, 2),
	(6, 4, 1, 15, 2),
	(7, 4, 1, 18, 2);

-- Dumping structure for table techmart_online.main_category
CREATE TABLE IF NOT EXISTS `main_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.main_category: ~7 rows (approximately)
REPLACE INTO `main_category` (`id`, `name`) VALUES
	(1, 'Mobile Stuff'),
	(2, 'Laptops'),
	(3, 'Smartwatch'),
	(4, 'Computer Parts'),
	(5, 'Audio Products'),
	(6, 'PC & Laptop Accessories'),
	(7, 'PC & Laptop Accessories'),
	(8, 'Office Stuff');

-- Dumping structure for table techmart_online.order_status
CREATE TABLE IF NOT EXISTS `order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.order_status: ~4 rows (approximately)
REPLACE INTO `order_status` (`id`, `value`) VALUES
	(1, 'Paid'),
	(2, 'Pending'),
	(3, 'Processing'),
	(4, 'Shipped'),
	(5, 'Delivered');

-- Dumping structure for table techmart_online.product
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `sub_category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `discount` int NOT NULL,
  `created_at` datetime NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_sub_category1_idx` (`sub_category_id`),
  KEY `fk_product_brand1_idx` (`brand_id`),
  KEY `fk_product_status1_idx` (`status_id`),
  CONSTRAINT `fk_product_brand1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `fk_product_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  CONSTRAINT `fk_product_sub_category1` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.product: ~19 rows (approximately)
REPLACE INTO `product` (`id`, `title`, `description`, `sub_category_id`, `brand_id`, `discount`, `created_at`, `status_id`) VALUES
	(2, 'Solar Neo Calling Smartwatch', '1.53" HD colorful display\r\nUpgraded Rotating Crown\r\nOne-tap Connection Bluetooth Calling\r\nAdvanced Bluetooth 5.3\r\nIP68 Water Resistance\r\nUpgraded View Modes', 3, 3, 5, '2026-06-21 00:35:39', 1),
	(3, 'Apple MacBook Neo 13 inch 256GB', 'A18 Pro chip for fast performance', 2, 1, 5, '2026-06-21 00:52:00', 1),
	(4, 'Asus ExpertBook B1502CVA i5 13TH GEN', 'Asus ExpertBook B1502CVA i5 13TH GEN\r\n\r\nIntelÂ® Coreâ¢ i5-1335U 1.3GHz (12MB Cache, up to 4.6GHz, )\r\n\r\n8GB DDR4 3200MHZ (8GB x 1 on board)\r\n\r\n512GB NVME M.2 SSD\r\n\r\n15.6" FHD (1920x1080) Anti-glare 300Nits\r\n\r\nIntel UHD Graphics\r\n\r\nBacklit Chiclet Keyboard, With Touch ID\r\n\r\n1.69 kg , 42WHrs\r\n\r\nASUS Backpack\r\n\r\n2 Years Company Warranty\r\n\r\nNo OS\r\n\r\n', 4, 6, 5, '2026-06-23 03:02:35', 1),
	(5, 'ASUS TUF GAMING A15', 'ASUS TUF GAMING A15 FA506NCG RYZEN 7 7000 SERIES RTX 3050\r\nAMD Ryzen 7 7445HS (22MB Cache, up to 4.7GHz, 6 cores, 12 Threads)\r\n16GB DDR5 5600MHZ (16GB x 1)\r\n512GB M.2 NVMe PCIeÂ® 4.0 SSD\r\n15.6" 1080P 144Hz Anti-Glare IPS-level\r\nNVIDIAÂ® GeForce RTX 3050 4GB GDDR6 TGP 75W\r\n1-Zone RGB Backlit Chiclet Keyboard\r\n2.3kg, 48WHrs\r\nFree ASUS TUF BACKPACK\r\n18 Months Company warranty\r\nGenuine Windows 11 Home 64Bit Pre-installed', 6, 6, 10, '2026-06-23 03:04:21', 1),
	(6, 'Apple MacBook Air M5 13 inch 16GB RAM 512GB', '13.6â³ Liquid Retina, 500 nits\r\nM5 chip, 10-core CPU\r\n8/10-core GPU, AI engine\r\n16GB RAM, up to 32GB\r\n512GB SSD, up to 4TB\r\n18hr battery, MagSafe 3', 5, 1, 0, '2026-06-23 03:07:17', 1),
	(7, 'Xiaomi Mi Smart Band 10', '1.72" AMOLED display\r\nEnhanced sleep management\r\n150+ sports modes\r\n5ATM* water resistance\r\nUp to 21-day long battery life(Depends on Usage', 3, 3, 5, '2026-06-23 03:09:32', 1),
	(8, 'Samsung Galaxy Fit 3 Smartwatch', '1.6" large AMOLED display\r\nUp to 13 days on a single charge*\r\nTracking sleep and over 100 exercises\r\nInstant notifications and media controls\r\n* Incompatible with iOS *\r\nTEMPERED GLASS SOLD SEPERATELY', 3, 2, 0, '2026-06-23 03:10:28', 1),
	(9, 'Haylou Watch 4S GPS Smart Watch (LS26)', '1.43" AMOLED HD Display\r\nFive-Star GPS\r\nAluminum alloy rotating crown\r\n1ATM Waterproof', 3, 8, 5, '2026-06-23 03:11:36', 1),
	(10, 'Redmi Watch 5 Active Calling Smartwatch', 'Built for Resistance\r\nUp to 18-Day Battery Duration\r\nIPX8 rated for splash and sweat resistance\r\n200+Unique Watch Faces\r\nHigh Resolution 5.08cm (2.0) Display\r\nAlexa Built In', 3, 2, 10, '2026-06-23 03:13:06', 1),
	(11, 'Anker Soundcore R50i NC True Wireless', 'Hidden cell phone holder\r\n4 Mic Al-Powered Calls\r\nPowerful 10mm Drivers\r\nIP54 Sweatguard\r\nAdaptive ANC\r\nUp to 10Hr Battery Life', 20, 4, 6, '2026-06-23 03:15:23', 1),
	(12, 'Anker Soundcore Space One', 'Adaptive ANC\r\nCrisp, High Res Sound\r\nLDAC Audio\r\nUp to 40 HR Playtime', 22, 4, 5, '2026-06-23 03:16:32', 1),
	(13, 'JBL Tune 670NC Wireless Headphones', 'Adaptive Noise Cancelling with Smart Ambient\r\nBluetooth 5.3 with LE Audio\r\nJBL Pure Bass Sound\r\nHands-free calls with VoiceAware', 22, 5, 6, '2026-06-23 03:17:39', 1),
	(14, 'Xiaomi Mi Sound Outdoor 30W', 'Bluetooth 5.4\r\nTrue Wireless Stereo Sound\r\nIP67 Dust and Water Resistance\r\nLong-lasting Battery\r\nImmersive Sound Experience Powerful 30W Output', 23, 3, 5, '2026-06-23 03:18:59', 1),
	(15, 'Amazon Echo Dot (5th Gen)', 'Front-firing speaker\r\nBuilt-in microphone off button and in-app privacy controls\r\nJust ask Alexa to play music, podcasts, and audiobooks\r\nMotion Detection', 24, 5, 5, '2026-06-23 03:20:36', 1),
	(16, 'JBL Grip Portable Speaker', 'Up to 14 hours of playtime\r\nAmbient light\r\nMulti-speaker connection\r\nJBL Portable app\r\nBold JBL Pro Sound', 23, 5, 6, '2026-06-23 03:21:31', 1),
	(17, 'ASUS TUF GAMING VG279QE5A 27"', 'Model\r\nTUF Gaming VG279QE5A\r\nDisplay\r\nPanel Size (inch) : 27\r\nAspect Ratio : 16:9\r\nDisplay Viewing Area (H x V) : 597.89 x 336.31 mm\r\nDisplay Surface : Anti-Glare\r\nBacklight Type : LED\r\nPanel Type : IPS\r\nViewing Angle (CRâ§10, H/V) : 178Â°/ 178Â°\r\nPixel Pitch : 0.311mm\r\nResolution : 1920x1080\r\nColor Space (sRGB) : 125%\r\nColor Space (DCI-P3) : 90%\r\nBrightness (Typ.) : 300cd/ã¡\r\nContrast Ratio (Typ.) : 1500:1\r\nDisplay Colors : 16.7M\r\nResponse Time : 1ms MPRT\r\nRefresh Rate (Max) : 146Hz\r\nFlicker-free : Yes\r\n\r\nFeatures\r\nGameVisual : Yes\r\nColor Temp. Selection : Yes (4 modes)\r\nGamePlus : Yes\r\nHDCP : Yes\r\nExtreme Low Motion Blur : Yes\r\nELMB Sync: Yes\r\nVRR Technology : Yes (Adaptive-Sync)\r\nShadow Boost : Yes\r\nDisplayWidget : Yes, DisplayWidget Center\r\nLow Blue Light : Yes\r\nA.I. Assistant Technology : Dynamic Crosshair\r\n\r\nAI Visual\r\n\r\nAudio\r\nSpeaker : Yes(2Wx2)\r\n\r\nI/O Ports\r\nDisplayPort 1.2 x 1\r\nHDMI(v2.0) x 1\r\nEarphone Jack : Yes\r\n\r\nSignal Frequency\r\nDigital Signal Frequency : HDMI: 30-180 KHz(H)/ 48-146 HZ(V)\r\nDP: 180-180 KHz(H)/ 48-146 HZ(V)\r\n\r\nPower Consumption\r\nPower Consumption : 16.7 W**\r\nPower Saving Mode : < 0.5W\r\nPower Off Mode : <0.3W\r\nVoltage : 100-240V, 50/60Hz\r\n\r\nMechanical Design\r\nTilt : Yes (+23Â° ~ -5Â°)\r\nHeight Adjustment : No\r\nVESA Wall Mounting : 100x100mm\r\nKensington Lock : Yes\r\n\r\nDimensions (Esti.)\r\nPhys. Dimension (W x H x D) : 61.5 x 45.3 x 19.3 cm (24.21" x 17.83" x 7.60")\r\nPhys. Dimension without Stand (W x H x D) : 61.5 x 36.9 x 6.0 cm (24.21" x 14.53" x 2.36")\r\nBox Dimension (W x H x D) : 68.0 x 45.0 x 17.1 cm (26.77" x 17.72" x 6.73")\r\n\r\nWeight (Esti.)\r\nNet Weight : 4.4 kg (9.70 lbs)\r\nNet Weight without Stand : 3.6 kg (7.94 lbs)\r\nGross Weight : 6.3 kg (13.89 lbs)\r\n\r\nAccessories (vary by regions)\r\nWarranty Card\r\n\r\nQuick start guide\r\n\r\nPower cord\r\n\r\nL-shaped Screwdriver\r\n\r\nHDMI cable\r\n\r\nCertificate\r\nFSC MIX\r\nTÃV Low Blue Light\r\nTÃV Flicker-free', 8, 6, 5, '2026-06-23 03:23:31', 1),
	(18, 'Lenovo Legion 24" 24-10 IPS 1080P', 'Screen Size: 23.8-inch\r\n\r\nPanel Type: IPS (In-Plane Switching) â provides wide viewing angles and consistent colors.\r\n\r\nResolution: Full HD (1920 x 1080)\r\n\r\nRefresh Rate: 240Hz (Ultra-smooth for fast-paced gaming)\r\n\r\nResponse Time: 0.5ms (MPRT) / 1ms (Extreme Mode)\r\n\r\nBrightness: 300 cd/mÂ²\r\n\r\nContrast Ratio: 1000:1', 8, 10, 5, '2026-06-23 03:25:04', 1),
	(19, 'ASUS VA24EHFA 24\' IPS FHD 100HZ', '23.8-inch Full HD (1920x1080) frameless design with IPS 178Â° wide viewing angle panel\r\nSmoothMotion 100Hz refresh rate and 1ms MPRT delivers a seamless, tear-free visual experience by enabling VRR (variable refresh rate)\r\nBuilt-in stereo speakers for limitless entertainment and multimedia enjoyment\r\nVESA wall-mountable to save on desktop space\r\nASUS Eye Care monitors feature TÃV Rheinland-certified Flicker-free and Low Blue Light technologies to ensure a comfortable viewing experience', 7, 6, 6, '2026-06-23 03:26:42', 1),
	(20, 'MSI MAG PANO 110R PZ', 'Product Name\r\nMAG PANO 110R PZ / Black\r\nCase Form Factor\r\nMid-Tower\r\nMotherboard Form Factor Support\r\nRegular:\r\nATX / Micro-ATX / Mini-ITX\r\nBack-connect:\r\nATX / Micro-ATX\r\nI/O Ports\r\n1 x USB 20Gbs (Type-C)\r\n2 x USB 5Gbs (Type-A)\r\n1 x Audio-Out / Mic-in\r\n1 x LED Button\r\n1 x Power Button\r\nDrive Mount Support', 15, 7, 5, '2026-06-23 03:28:11', 1);

-- Dumping structure for table techmart_online.ratings
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.ratings: ~2 rows (approximately)
REPLACE INTO `ratings` (`id`, `value`) VALUES
	(1, 'Good'),
	(2, 'Not Bad'),
	(3, 'Bad');

-- Dumping structure for table techmart_online.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `review_text` text NOT NULL,
  `created_at` datetime NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_product1_idx` (`product_id`),
  KEY `fk_reviews_user1_idx` (`user_id`),
  CONSTRAINT `fk_reviews_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_reviews_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.reviews: ~0 rows (approximately)

-- Dumping structure for table techmart_online.status
CREATE TABLE IF NOT EXISTS `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.status: ~3 rows (approximately)
REPLACE INTO `status` (`id`, `value`) VALUES
	(1, 'Active'),
	(2, 'Inactive'),
	(3, 'Pending');

-- Dumping structure for table techmart_online.stock
CREATE TABLE IF NOT EXISTS `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` double NOT NULL,
  `qty` int NOT NULL,
  `product_id` int NOT NULL,
  `warehouse_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stock_product1_idx` (`product_id`),
  KEY `fk_stock_warehouse1_idx` (`warehouse_id`),
  CONSTRAINT `fk_stock_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_stock_warehouse1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.stock: ~19 rows (approximately)
REPLACE INTO `stock` (`id`, `price`, `qty`, `product_id`, `warehouse_id`) VALUES
	(1, 6999, 8, 2, 1),
	(2, 249900, 4, 3, 2),
	(3, 224000, 11, 4, 1),
	(4, 325000, 22, 5, 1),
	(5, 424900, 4, 6, 1),
	(6, 15999, 5, 7, 2),
	(7, 13999, 10, 8, 1),
	(8, 10999, 12, 9, 1),
	(9, 11499, 5, 10, 1),
	(10, 7399, 9, 11, 1),
	(11, 20999, 45, 12, 1),
	(12, 18999, 14, 13, 1),
	(13, 16999, 11, 14, 1),
	(14, 18999, 5, 15, 1),
	(15, 24999, 8, 16, 1),
	(16, 46500, 8, 17, 1),
	(17, 39500, 5, 18, 1),
	(18, 32000, 6, 19, 1),
	(19, 29500, 5, 20, 1);

-- Dumping structure for table techmart_online.sub_category
CREATE TABLE IF NOT EXISTS `sub_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sub_category_category1_idx` (`category_id`),
  CONSTRAINT `fk_sub_category_category1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.sub_category: ~22 rows (approximately)
REPLACE INTO `sub_category` (`id`, `name`, `category_id`) VALUES
	(1, 'Mobile Phones', 1),
	(2, 'Laptops', 2),
	(3, 'Smart Watches', 3),
	(4, 'Ultrabooks & Thin-and-Lights', 2),
	(5, 'Business & Enterprise Laptops', 2),
	(6, 'Gaming Laptops', 2),
	(7, 'Everyday/Office Monitors', 7),
	(8, 'Gaming Monitors', 7),
	(9, 'Professional/Creator Monitors', 7),
	(10, 'IPS', 7),
	(11, 'VA', 7),
	(12, 'TN', 7),
	(13, 'OLED', 7),
	(14, 'Mini Tower / Small Form Factor', 8),
	(15, 'Mid Tower', 8),
	(16, 'Full Tower', 8),
	(17, 'DDR3', 9),
	(18, 'DDR4', 9),
	(19, 'DDR5', 9),
	(20, 'Wireless Buds', 10),
	(21, 'In-Ear', 10),
	(22, 'On-Ear', 10),
	(23, 'Portable Speakers', 11),
	(24, 'Smart Speakers', 11),
	(25, 'Sound Bars', 11);

-- Dumping structure for table techmart_online.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `verification_code` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_status_idx` (`status_id`),
  CONSTRAINT `fk_user_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.user: ~3 rows (approximately)
REPLACE INTO `user` (`id`, `username`, `email`, `mobile`, `password`, `verification_code`, `created_at`, `status_id`) VALUES
	(1, 'tendergoldwasser6', 'tendergoldwasser6@justzeus.com', '0760099123', 'Qwer@123', 'Verified', '2026-06-26 02:25:35', 1),
	(2, 'nobadi7407', 'nobadi7407@dosonex.com', '0771234567', 'Qwer@123', 'Verified', '2026-06-26 02:32:20', 1),
	(3, 'Doris K. Thomas', 'gocoleh408@misehub.com', '0757878098', 'Qwer@123', 'Verified', '2026-06-26 02:37:22', 1);

-- Dumping structure for table techmart_online.user_address
CREATE TABLE IF NOT EXISTS `user_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  `full_name` varchar(45) NOT NULL,
  `address` text NOT NULL,
  `postal_code` varchar(5) NOT NULL,
  `mobile` varchar(45) NOT NULL,
  `city_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_address_city1_idx` (`city_id`),
  KEY `fk_user_address_user1_idx` (`user_id`),
  CONSTRAINT `fk_user_address_city1` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`),
  CONSTRAINT `fk_user_address_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.user_address: ~2 rows (approximately)
REPLACE INTO `user_address` (`id`, `type`, `full_name`, `address`, `postal_code`, `mobile`, `city_id`, `user_id`) VALUES
	(1, 'Home', 'tendergoldwasser6', '74 Jampettah Street, 13', '20650', '0760099123', 3, 1),
	(2, 'Home', 'nobadi7407', '172 Hulftsdorp Street, 12', '29800', '0774545543', 5, 2),
	(3, 'Home', 'Thomas', '70/1 Ward Place, 07', '26543', '0754536543', 6, 3);

-- Dumping structure for table techmart_online.warehouse
CREATE TABLE IF NOT EXISTS `warehouse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table techmart_online.warehouse: ~2 rows (approximately)
REPLACE INTO `warehouse` (`id`, `name`) VALUES
	(1, 'Main'),
	(2, 'Sub1');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
