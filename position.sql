CREATE TABLE IF NOT EXISTS `currentPosition`(`id` int(11) NOT NULL ,`xValue` real  NOT NULL,`yValue` real  NOT NULL,`zValue` real  NOT NULL,PRIMARY KEY (`id`));

INSERT INTO currentPosition(id,xValue,yValue,zValue) VALUES (1,0.0,0.0,0.0);

UPDATE `currentPosition` SET `xValue`=0, `yValue`=0, `zValue`=0 WHERE `id`=1;