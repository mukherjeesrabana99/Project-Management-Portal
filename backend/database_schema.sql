-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: project_management_portal
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(225) NOT NULL,
  `entity_type` enum('user','project','client') DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activitry_log_user_fk_idx` (`user_id`),
  CONSTRAINT `activitry_log_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (2,17,'created user','user',19,NULL),(3,17,'created user','user',20,NULL),(4,17,'created user','user',21,NULL),(5,17,'created user','user',22,NULL),(6,17,'created user','user',23,NULL),(7,17,'created user','user',18,NULL),(8,17,'created user','user',24,NULL),(9,17,'created user','user',25,NULL),(10,17,'created user','user',26,NULL),(11,17,'created user','user',27,NULL),(12,17,'created user','user',28,NULL),(13,17,'created user','user',29,NULL),(14,17,'created user','user',30,NULL),(15,17,'created user','user',31,NULL),(16,17,'created user','user',32,NULL),(17,17,'created user','user',33,NULL),(18,17,'created project','project',25,NULL),(19,17,'created project','project',29,NULL),(20,17,'created project','project',30,NULL),(21,17,'created project','project',34,NULL),(22,17,'created project','project',26,NULL),(23,17,'created project','project',31,NULL),(24,17,'created project','project',35,NULL),(25,17,'created project','project',27,NULL),(26,17,'created project','project',32,NULL),(27,17,'created project','project',36,NULL),(28,17,'created project','project',28,NULL),(29,17,'created project','project',33,NULL),(30,17,'created client','client',16,NULL),(31,17,'created client','client',17,NULL),(32,17,'created client','client',18,NULL),(33,17,'created client','client',19,NULL);
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(225) NOT NULL,
  `contact_person` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (16,'Tech Innovations Inc.','John Doe','john.doe@techinnovations.com','+1-555-0123','2026-04-26 18:47:08','2026-04-26 18:47:08'),(17,'Global Solutions Ltd.','Jane Smith','jane.smith@globalsolutions.com','+1-555-0456','2026-04-26 18:47:23','2026-04-26 18:47:23'),(18,'Creative Designs Co.','Bob Johnson','bob.johnson@creativedesigns.com','+1-555-0789','2026-04-26 18:47:40','2026-04-26 18:47:40'),(19,'Data Analytics Pro','Alice Brown','alice.brown@dataanalyticspro.com','+1-555-0321','2026-04-26 18:48:09','2026-04-26 18:48:09'),(20,'Client One Solutions','Client One','client.one@clientone.com','+1637636','2026-04-27 09:55:09','2026-04-27 09:55:09');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_status_logs`
--

DROP TABLE IF EXISTS `project_status_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_status_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `old_status` varchar(225) DEFAULT NULL,
  `new_status` varchar(225) DEFAULT NULL,
  `changed_by` int DEFAULT NULL,
  `changed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id_fk_idx` (`project_id`),
  KEY `project_status_logs_client_fk_idx` (`changed_by`),
  CONSTRAINT `project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_status_logs_client_fk` FOREIGN KEY (`changed_by`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_status_logs`
--

LOCK TABLES `project_status_logs` WRITE;
/*!40000 ALTER TABLE `project_status_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_status_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_users`
--

DROP TABLE IF EXISTS `project_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_user_user_fk_idx` (`user_id`),
  KEY `project_user_project_fk_idx` (`project_id`),
  CONSTRAINT `project_user_project_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `project_user_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_users`
--

LOCK TABLES `project_users` WRITE;
/*!40000 ALTER TABLE `project_users` DISABLE KEYS */;
INSERT INTO `project_users` VALUES (24,25,24),(25,25,25),(26,26,26),(27,26,27),(28,26,28),(29,27,29),(30,28,30),(31,28,31),(32,29,32),(33,30,32),(34,31,24),(35,31,26),(36,31,28),(37,32,25),(38,32,27),(39,33,29),(40,33,31),(41,33,33),(42,34,30),(43,35,24),(44,35,36),(45,36,25),(46,36,27),(47,36,36);
/*!40000 ALTER TABLE `project_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(225) NOT NULL,
  `description` varchar(225) DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `status` varchar(225) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_client_fk_idx` (`client_id`),
  CONSTRAINT `project_client_fk` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (25,'Website Redesign Phase 1','Initial redesign of the company website with modern UI/UX',16,'planned','2024-05-01 00:00:00','2024-07-01 00:00:00'),(26,'Mobile App Development','Develop cross-platform mobile application',17,'planned','2024-05-15 00:00:00','2024-09-15 00:00:00'),(27,'Database Optimization','Optimize database performance and implement indexing',18,'planned','2024-06-01 00:00:00','2024-08-01 00:00:00'),(28,'API Integration Project','Integrate third-party APIs for enhanced functionality',19,'planned','2024-06-15 00:00:00','2024-08-15 00:00:00'),(29,'Security Audit Implementation','Implement security measures based on recent audit',16,'planned','2024-07-01 00:00:00','2024-09-01 00:00:00'),(30,'Security Audit Implementation','Implement security measures based on recent audit',16,'planned','2024-07-01 00:00:00','2024-09-01 00:00:00'),(31,'E-commerce Platform Upgrade','Upgrade existing e-commerce platform to latest version',17,'planned','2024-07-15 00:00:00','2024-10-15 00:00:00'),(32,'Data Analytics Dashboard','Create comprehensive business intelligence dashboard',18,'planned','2024-08-01 00:00:00','2024-11-01 00:00:00'),(33,'Cloud Migration Initiative','Migrate on-premise infrastructure to cloud',19,'planned','2024-08-15 00:00:00','2024-12-15 00:00:00'),(34,'User Training Program','Develop and deliver comprehensive user training materials',16,'planned','2024-09-01 00:00:00','2024-11-01 00:00:00'),(35,'Performance Monitoring System','Implement real-time performance monitoring and alerting',20,'planned','2024-09-15 00:00:00','2024-12-15 00:00:00'),(36,'Quality Assurance Framework','Establish comprehensive QA testing framework',20,'planned','2024-10-01 00:00:00','2025-01-01 00:00:00');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(225) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin'),(2,'Client'),(3,'User');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(225) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(225) NOT NULL,
  `email` varchar(225) NOT NULL,
  `password` varchar(225) NOT NULL,
  `role_id` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `user_role_fk_idx` (`role_id`),
  KEY `user_client_fk_idx` (`client_id`),
  CONSTRAINT `user_client_fk` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `user_role_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (17,'Admin','admin@gmail.com','$2b$12$X0hoAQHBkmJv4qP0.y0jvOitOG2U6W7VmEXXhCuopmGHK9rDJLqci',1,NULL,'2026-04-26 18:40:53','2026-04-26 18:40:53'),(18,'User','user@gmail.com','$2b$12$iuRpTQtNSnFHQ4GJZjo3dObyh72Ltc3eMRhpCt4HjglPLgyJu31zm',3,NULL,'2026-04-26 18:41:48','2026-04-26 18:41:48'),(19,'Client','client@gmail.com','$2b$12$9Y.13uX/ybYETJwfn3AddOd/1HcRsjqFgQ47nOUY0sjZ8OpFSpfyW',2,NULL,'2026-04-26 18:42:08','2026-04-26 18:42:08'),(20,'Tech Innovations Inc','john.doe@techinnovations.com','$2b$12$qw.aEHPSOdvc.YFd9FMl3uBQyKUWLskl35C0GSEqkJs9c5z/zcagO',2,16,'2026-04-26 18:52:33','2026-04-26 18:52:33'),(21,'Global Solutions','jane.smith@globalsolutions.com','$2b$12$Jo5ub3pKTxewGOgC3w4kxe8irpJPrO81DDRbUYOneYAXILQi/.dBS',2,17,'2026-04-26 18:53:12','2026-04-26 18:53:12'),(22,'Creative Designs','bob.johnson@creativedesigns.com','$2b$12$OstGnYKkcAbAqv/XAO1/5ODTzMyO8D621mkMzUzpPc9k3n8qSuzia',2,18,'2026-04-26 18:53:53','2026-04-26 18:53:53'),(23,'Data Analytics Pro','alice.brown@dataanalyticspro.com','$2b$12$teZL7.4KggQwtFE9Gj4VXOzHrGD3LXstCHqcePqSoYcbZd7GFFKzO',2,19,'2026-04-26 18:54:38','2026-04-26 18:54:38'),(24,'Michael Johnson','michael.johnson@example.com','$2b$12$xWeEYGsMIV0WlC6TllDc9eXSXNnjC/B7NyGYz3JUbKAVTlVjNnhuy',3,NULL,'2026-04-26 18:56:15','2026-04-26 18:56:15'),(25,'Sarah Williams','sarah.williams@example.com','$2b$12$TL1RTLFWJcQqcUaeaj1xh.qrfs/KOMk7Kg3t6kQVaGJyG9rfyncbG',3,NULL,'2026-04-26 18:56:40','2026-04-26 18:56:40'),(26,'David Brown','david.brown@example.com','$2b$12$lUVrQupX/Vqe6w6A/Iim9OD8OGFxf/o6ZX0nQNWBB4kW8QnQk.lme',3,NULL,'2026-04-26 18:57:53','2026-04-26 18:57:53'),(27,'Emily Davis','emily.davis@example.com','$2b$12$AuCe1ydjIYi6l2S/38XAEevZL3GUAZ190JcdazfMc1txYHdT9PWmO',3,NULL,'2026-04-26 18:58:06','2026-04-26 18:58:06'),(28,'James Miller','james.miller@example.com','$2b$12$S./tUWmTbEEAcsok.casrOmhibVFrRt7BFrFdPNAg42AvenhthKPe',3,NULL,'2026-04-26 18:58:35','2026-04-26 18:58:35'),(29,'Olivia Wilson','olivia.wilson@example.com','$2b$12$JCyaUV16VlczBiL/KMA5Z.Ve47E9QqFH5ImDkGCHM1vaQ0Gnfmv/C',3,NULL,'2026-04-26 18:58:49','2026-04-26 18:58:49'),(30,'Sophia Taylor','sophia.taylor@example.com','$2b$12$JCaSykWiNSjiYR4GNivuiebTprK1zuyJDfniNxKzP94RHEUDjf4ka',3,NULL,'2026-04-26 18:59:02','2026-04-26 18:59:02'),(31,'William Moore','william.moore@example.com','$2b$12$vMXko9EcZ0JDtNYhQi2x2OxFYdeMbKPFStPekDewZNtdqQkHYvAPe',3,NULL,'2026-04-26 18:59:13','2026-04-26 18:59:13'),(32,'Benjamin Anderson','benjamin.anderson@example.com','$2b$12$jT0EKlp9qpMC/aeVHtasS.LFqCWukeeKMXhqFGZIE9B5NAIADKgrC',3,NULL,'2026-04-26 18:59:43','2026-04-26 18:59:43'),(33,'Isabella Thomas','isabella.thomas@example.com','$2b$12$3yfLDNIFX7xQH/l/7zI6WOa8vjqCyl/r9qATkGKT5UcHffbun51HO',3,NULL,'2026-04-26 18:59:54','2026-04-26 18:59:54'),(34,'AdminOne','adminone@gmail.com','$2b$12$s67OUvpEr4RuOBIDlPAgbO3zhIBtmrrFgX9NzzxmxUjhV2PfcLGF.',1,NULL,'2026-04-26 20:13:00','2026-04-26 20:13:00'),(35,'ClientOne','clientone@gmail.com','$2b$12$brnwPdO6GYM2q9S3E3GXiONIM7JRi7V9wOstUylWMe2XK6ONow1PO',2,20,'2026-04-26 20:39:15','2026-04-26 20:39:15'),(36,'UserOne','userone@gmail.com','$2b$12$bO9niqkmNCDHPK87bteFc.leNDT5AFUV0vVQJxeOkPNDrb7EEol1a',3,NULL,'2026-04-27 09:20:02','2026-04-27 09:20:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 11:04:04
