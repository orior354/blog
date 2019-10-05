
START TRANSACTION;

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `comments` (`id`, `body`, `created_at`, `updated_at`) VALUES
(63, '<p>1</p>', '2019-10-05 12:41:26', '2019-10-05 12:41:26'),
(64, '<p>2</p>', '2019-10-05 12:41:29', '2019-10-05 12:41:29'),
(65, '<p>3</p>', '2019-10-05 12:41:33', '2019-10-05 12:41:33'),
(66, '<p>4</p>', '2019-10-05 12:41:36', '2019-10-05 12:41:36'),
(67, '<p>5</p>', '2019-10-05 12:41:40', '2019-10-05 12:41:40'),
(68, '<p>6</p>', '2019-10-05 12:41:44', '2019-10-05 12:41:44'),
(69, '<p>7</p>', '2019-10-05 12:41:47', '2019-10-05 12:41:47'),
(70, '<p>8</p>', '2019-10-05 12:41:52', '2019-10-05 12:41:52'),
(71, '<p>9</p>', '2019-10-05 12:41:56', '2019-10-05 12:41:56'),
(72, '<p>10</p>', '2019-10-05 12:42:02', '2019-10-05 12:42:02'),
(73, '<p>11</p>', '2019-10-05 12:42:06', '2019-10-05 12:42:06'),
(74, '<p>12</p>', '2019-10-05 12:42:10', '2019-10-05 12:42:10'),
(75, '<p>13</p>', '2019-10-05 12:42:15', '2019-10-05 12:42:15'),
(76, '<p>14</p>', '2019-10-05 12:42:20', '2019-10-05 12:42:20'),
(77, '<p>15</p>', '2019-10-05 12:42:25', '2019-10-05 12:42:25'),
(78, '<p>16</p>', '2019-10-05 12:42:30', '2019-10-05 12:42:30'),
(79, '<p>17</p>', '2019-10-05 12:42:36', '2019-10-05 12:42:36'),
(80, '<p>18</p>', '2019-10-05 12:42:42', '2019-10-05 12:42:42'),
(81, '<p>19</p>', '2019-10-05 12:42:47', '2019-10-05 12:42:47'),
(82, '<p>20</p>', '2019-10-05 12:42:53', '2019-10-05 12:42:53'),
(83, '<p>21</p>', '2019-10-05 12:42:58', '2019-10-05 12:42:58'),
(84, '<p>22</p>', '2019-10-05 12:43:03', '2019-10-05 12:43:03');

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;COMMIT;