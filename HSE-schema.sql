CREATE DATABASE  IF NOT EXISTS `HSE2` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `HSE2`;
-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: HSE2
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lectures`
--

DROP TABLE IF EXISTS `lectures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lectures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic` varchar(255) DEFAULT NULL,
  `profId` int(11) DEFAULT NULL,
  `slackId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profId` (`profId`),
  KEY `slackId` (`slackId`),
  CONSTRAINT `lectures_ibfk_1` FOREIGN KEY (`profId`) REFERENCES `users` (`id`),
  CONSTRAINT `lectures_ibfk_2` FOREIGN KEY (`slackId`) REFERENCES `slack` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectures`
--

LOCK TABLES `lectures` WRITE;
/*!40000 ALTER TABLE `lectures` DISABLE KEYS */;
INSERT INTO `lectures` VALUES (3,'IOT_Ecosystems',9,1),(4,'Mathe',8,2),(5,'Datenbanken 2',9,3);
/*!40000 ALTER TABLE `lectures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `occupancy`
--

DROP TABLE IF EXISTS `occupancy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `occupancy` (
  `roomId` int(11) NOT NULL,
  `lectureId` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `day` varchar(45) NOT NULL,
  `rrule` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`roomId`,`lectureId`,`start`,`end`,`day`, `rrule`),
  KEY `occupancy_ibfk_2` (`lectureId`),
  CONSTRAINT `occupancy_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`),
  CONSTRAINT `occupancy_ibfk_2` FOREIGN KEY (`lectureId`) REFERENCES `lectures` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `occupancy`
--

LOCK TABLES `occupancy` WRITE;
/*!40000 ALTER TABLE `occupancy` DISABLE KEYS */;
INSERT INTO `occupancy` VALUES (1,3,'09:30:00','11:00:00','Dienstag',NULL),(1,3,'14:00:00','17:15:00','Dienstag',NULL),(1,5,'14:00:00','17:15:00','Dienstag',NULL),(2,4,'14:00:00','17:15:00','Montag',NULL),(2,5,'09:30:00','11:00:00','Dienstag',NULL);
/*!40000 ALTER TABLE `occupancy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participant`
--

DROP TABLE IF EXISTS `participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `participant` (
  `userId` int(11) NOT NULL,
  `lecturesId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`lecturesId`),
  KEY `lecturesId` (`lecturesId`),
  CONSTRAINT `participant_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `participant_ibfk_2` FOREIGN KEY (`lecturesId`) REFERENCES `lectures` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participant`
--

LOCK TABLES `participant` WRITE;
/*!40000 ALTER TABLE `participant` DISABLE KEYS */;
INSERT INTO `participant` VALUES (1,3),(2,3),(3,3),(1,4),(3,4),(3,5);
/*!40000 ALTER TABLE `participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingNr` varchar(11) NOT NULL,
  `roomNr` varchar(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,203),(2,1,311);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slack`
--

DROP TABLE IF EXISTS `slack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slack` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teamId` varchar(255) DEFAULT NULL,
  `channelId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slack`
--

LOCK TABLES `slack` WRITE;
/*!40000 ALTER TABLE `slack` DISABLE KEYS */;
INSERT INTO `slack` VALUES (1,'TR0A3UUBA','CSH3U9F7X'),(2,'2','22'),(3,'3','33');
/*!40000 ALTER TABLE `slack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `surname` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` int(11) DEFAULT '0',
  `email` varchar(45) DEFAULT NULL,
  `pwdHash` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Karl','Marx  ',0,'test@test.com',''),(2,'Einstein ','Albert ',0,'albertostein@physicist.io',''),(3,'Newton ','Isaac ',0,'applehead@trees.oof',''),(4,'Curie ','Marie ',0,'cmglow@google.com',''),(5,'Koch','Robert',0,'',''),(6,'Planck','Max',0,'',''),(7,'Picasso','Pablo',0,'',''),(8,'Escobar','Pablo',0,'',''),(9,'Schiller','Friedrich',0,'',''),(10,'Schiller','Friedrich',0,'',''),(11,'Freeman','Gordan',1,'gordan.freeman@halflife.com','$2b$12$1mE2OI9hMS/rgH9Mi0s85OM2V5gzm7aF3gJIWH1y0S1MqVBueyjsy'),(12,'Smith','John',1,'jsmith@yahoo.com','$2b$12$1mE2OI9hMS/rgH9Mi0s85OM2V5gzm7aF3gJIWH1y0S1MqVBueyjsy');
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

-- Dump completed on 2020-01-09 10:50:06
