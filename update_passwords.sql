USE petclinic_auth_db;

UPDATE users SET password = '$2a$12$Scbln67MvxiSzg/dzgXi2.kjA89/SuGj9KfEmmusdKK9XI8I9Xs9K' WHERE id = 1;
UPDATE users SET password = '$2a$12$IND6qnRMH2.K7xZRlRcnQutM7.iIcfRD3q3P/izJY4nglglPV6BUW' WHERE id = 2;
UPDATE users SET password = '$2a$12$xIGUyjjtpS/C4Tn9c6z3re1jY8XT/iF0z2wLzHKewPrAj2IZBZifu' WHERE id = 3;
UPDATE users SET password = '$2a$12$F93aXQ93epKQE1Xg5EuyNug.xGyHNrzkePPtzjzHrnKNB.Qzz6HJe' WHERE id = 4;
UPDATE users SET password = '$2a$12$z4nN2fUyxROVSgrPUupqCeB5aA11KoKPbhlRutLK7Re5x.etTuXeS' WHERE id = 5;
UPDATE users SET password = '$2a$12$oqiQaACU1ztNGIPC0kEPMOmReznCwuaGvn.WwB4pzATOEY/0G8m5W' WHERE id = 6;
UPDATE users SET password = '$2a$12$9fp0ZI7aGtttw96yYPp2Qu4YuxfTmDmWFVq26B52lEQ5/b3Tbv19e' WHERE id = 7;
UPDATE users SET password = '$2a$12$KZRX9MOD17RWyJikf0H79OvAkr5TMWAZQHM3j36ZR7.EDG8REo0Qm' WHERE id = 8;
UPDATE users SET password = '$2a$12$xxFmx1.fnbiAIfL.b8vUyeU9VnkRnuyK52KkV64VoE/jlN42u4Dv6' WHERE id = 9;
UPDATE users SET password = '$2a$12$ZgjHe867L4bsRLqpauxfWeKdBfDMumpLaXXHNU.8b7ffWHr9JWHYe' WHERE id = 10;
UPDATE users SET password = '$2a$12$kTDvbjPZP9pwJoO05qZ6eefUq7xZkJQuqtJBwPD3bPrJd1pAoi4Eu' WHERE id = 11;
UPDATE users SET password = '$2a$12$PaK2HI8AWg2.mIF3LwQnKuDe13sXfKGqX2Qe7xfloa2IrbAl2HXqa' WHERE id = 12;
UPDATE users SET password = '$2a$12$HHLgOUa5SvXk96I5wWQGs.k6vb/OmspMVQqutWINq97l0UwqiNRta' WHERE id = 13;
UPDATE users SET password = '$2a$12$0pAThn6hISWPshXyWLPyOO1roxMV7RAx3uf6VD30tJFOT3CiRLeB2' WHERE id = 14;
UPDATE users SET password = '$2a$12$b.uj19pghKzdsDwoJ0ylk.UoD1qSL0eYkk8H6w1/Lic8f3x1DSWXm' WHERE id = 15;

-- Verify
SELECT id, name, email, role, LEFT(password,10) AS hash_preview FROM users;