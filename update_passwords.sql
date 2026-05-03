USE petclinic_auth_db;

UPDATE users SET password = '$2a$12$QVcsNGvXKrR6knn/W3xrBeofNlQRjPlOgR0.3N6qrU8KWoiHHtZSe' WHERE id = 1;
UPDATE users SET password = '$2a$12$HUWXLTTozDzf1989434TdOE3XkVTsEJ71UYIgu2IXEK6I08O/WNqe' WHERE id = 2;
UPDATE users SET password = '$2a$12$7jQOMBOpiES1b75PwJvvx.xf3PNLLDMDLuxJE.iATQU6IHLZVH9fO' WHERE id = 3;
UPDATE users SET password = '$2a$12$NeCJi3.ZCKup3zSWRColNePNUdIjz1WLJffMqryacBPVu4mhqTSVi' WHERE id = 4;
UPDATE users SET password = '$2a$12$JxfDuk.d6i9ALOfKqy.1NO.nTPrDc0gIwxRoY4Ypwc.tZk95J23tG' WHERE id = 5;
UPDATE users SET password = '$2a$12$Vah1aFKilL/Uc4IsoTIkjORYpRswqSx8rJfZh4qOCsVyJFPoWqU42' WHERE id = 6;
UPDATE users SET password = '$2a$12$Bgg9eVlvvnOS6ybMnjrMa.QRgIOIj6p9QokJfH6Cd1KzwZq9MpnKW' WHERE id = 7;
UPDATE users SET password = '$2a$12$ezkzZikkFMfEAchZpk7Y/evM16JTeAq2DVySZkX.w8wbBY1Xs1qWK' WHERE id = 8;
UPDATE users SET password = '$2a$12$a57d31OoMiz3tkbznYxrde9NCBN3stjM.tf7uFh8od0CkF7E5QQ.O' WHERE id = 9;
UPDATE users SET password = '$2a$12$9pNNMQPg/1oi4xqFPoP7bODTjYxuGa1jN4s1VAsBhhLeetDmU3v.u' WHERE id = 10;
UPDATE users SET password = '$2a$12$5t2NFTJ0l2SzCRuRiazdkuyfkMzgb1OQC9l8PXBYxuSQGVo0GDUe.' WHERE id = 11;
UPDATE users SET password = '$2a$12$xWfPm0VmSh3ewfsgLmEYDOC4sb0Ly0IAB8xoNnz4S7AG6dDT3dejq' WHERE id = 12;
UPDATE users SET password = '$2a$12$z98UfKzMVG6rNle0b9HWue77UE8KCmySSL/0nzzS0rXhC7VwVW40C' WHERE id = 13;
UPDATE users SET password = '$2a$12$eeMo437tG8aQc95RAtXjEu3kyqQ86lLIwuKM6tnqUbuaYuRScVSZm' WHERE id = 14;
UPDATE users SET password = '$2a$12$bu2zwEkdsrGp2rmUS1koz.rGIdbXjqulEjGslPGfwtPC1OmtyTLeW' WHERE id = 15;

-- Verify
SELECT id, name, email, role, LEFT(password,10) AS hash_preview FROM users;