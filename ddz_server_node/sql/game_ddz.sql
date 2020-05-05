-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2020-05-05 16:07:52
-- 服务器版本： 5.6.47
-- PHP Version: 7.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `game_ddz`
--

-- --------------------------------------------------------

--
-- 表的结构 `t_account`
--

CREATE TABLE `t_account` (
  `unique_id` varchar(255) NOT NULL,
  `account_id` varchar(255) NOT NULL,
  `nick_name` varchar(255) NOT NULL,
  `gold_count` bigint(20) NOT NULL DEFAULT '0',
  `avatar_url` varchar(255) DEFAULT NULL,
  `fkcount` int(11) NOT NULL DEFAULT '3' COMMENT '房卡数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `t_account`
--

INSERT INTO `t_account` (`unique_id`, `account_id`, `nick_name`, `gold_count`, `avatar_url`, `fkcount`) VALUES
('1019634', '2221780', 'tiny7', 2160, 'avatar_1', 4),
('1194001', '2600031', 'tiny2', 1680, 'avatar_2', 2),
('1848561', '2398371', 'tiny293', 880, 'avatar_3', 3),
('1981382', '2757345', 'tiny1', 2400, 'avatar_1', 0);

-- --------------------------------------------------------

--
-- 表的结构 `t_game_logs`
--

CREATE TABLE `t_game_logs` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL DEFAULT '0' COMMENT '房间号',
  `room_log_id` varchar(32) NOT NULL DEFAULT '0' COMMENT '牌局',
  `players` varchar(64) NOT NULL DEFAULT '' COMMENT '玩家列表',
  `cards` varchar(1024) NOT NULL DEFAULT '' COMMENT '初始牌',
  `fz` int(11) NOT NULL DEFAULT '0' COMMENT '房主',
  `dz` int(11) NOT NULL DEFAULT '0' COMMENT '地主',
  `winner` int(11) NOT NULL DEFAULT '0' COMMENT '赢家',
  `dzp` varchar(30) NOT NULL DEFAULT '' COMMENT '地主牌',
  `difen` int(11) NOT NULL DEFAULT '0' COMMENT '底分',
  `beishu` int(11) NOT NULL DEFAULT '0' COMMENT '倍数',
  `starttime` bigint(20) NOT NULL DEFAULT '0' COMMENT '开局时间',
  `finishtime` bigint(20) NOT NULL DEFAULT '0' COMMENT '收局时间',
  `jiesuanfen` int(11) NOT NULL DEFAULT '0' COMMENT '结算分',
  `refer_room_log_id` varchar(32) NOT NULL DEFAULT '0' COMMENT '关联牌局',
  `status` varchar(10) NOT NULL DEFAULT '0' COMMENT '当前状态',
  `quanshu` int(11) NOT NULL DEFAULT '0' COMMENT '整局圈数',
  `remark` varchar(64) DEFAULT '' COMMENT '牌局备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `t_game_logs_detail`
--

CREATE TABLE `t_game_logs_detail` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL COMMENT '房间号',
  `room_log_id` varchar(32) NOT NULL COMMENT '牌局',
  `player_id` varchar(32) NOT NULL COMMENT '玩家',
  `seat_index` int(11) NOT NULL DEFAULT '-1' COMMENT '座位号',
  `_act` varchar(32) NOT NULL COMMENT '动作：发牌、出牌、胜负、计分',
  `addtime` bigint(20) NOT NULL COMMENT '时间',
  `log` varchar(256) NOT NULL COMMENT '详情'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='出牌记录';

-- --------------------------------------------------------

--
-- 表的结构 `t_kf_log`
--

CREATE TABLE `t_kf_log` (
  `id` int(11) NOT NULL,
  `player_id` varchar(32) NOT NULL COMMENT '开房玩家',
  `room_id` int(11) NOT NULL COMMENT '房间号',
  `addtime` bigint(20) NOT NULL COMMENT '时间',
  `card_count` int(11) NOT NULL DEFAULT '0' COMMENT '剩余房卡数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='开房记录';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_account`
--
ALTER TABLE `t_account`
  ADD PRIMARY KEY (`unique_id`);

--
-- Indexes for table `t_game_logs`
--
ALTER TABLE `t_game_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_game_logs_detail`
--
ALTER TABLE `t_game_logs_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `t_kf_log`
--
ALTER TABLE `t_kf_log`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `t_game_logs`
--
ALTER TABLE `t_game_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `t_game_logs_detail`
--
ALTER TABLE `t_game_logs_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `t_kf_log`
--
ALTER TABLE `t_kf_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
