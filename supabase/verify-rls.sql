-- Run after setup.sql. All fixtures are rolled back. Any failed assertion
-- aborts the transaction; run ROLLBACK manually if the editor reports an error.
begin;
insert into auth.users(id) values
 ('3e612d83-f0b4-4321-988e-5531e0d4b401'),
 ('3e612d83-f0b4-4321-988e-5531e0d4b402');
set local role authenticated;
select set_config('request.jwt.claim.sub','3e612d83-f0b4-4321-988e-5531e0d4b401',true);
insert into public.wisdom_favorites(user_id,article_id,article_title,quote_text,page,end_page)
 values ('3e612d83-f0b4-4321-988e-5531e0d4b401','rls-test','权限测试','这是一条用于隔离权限验证的测试金句。',1,1);
do $$ begin
 if (select count(*) from public.wisdom_favorites where article_id='rls-test') <> 1 then raise exception 'Owner cannot read own favorite'; end if;
 begin
  insert into public.wisdom_favorites(user_id,article_id,article_title,quote_text,page,end_page)
   values ('3e612d83-f0b4-4321-988e-5531e0d4b402','rls-test','权限测试','不允许向其他账号写入这条测试金句。',1,1);
  raise exception 'Cross-user insert was allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','3e612d83-f0b4-4321-988e-5531e0d4b402',true);
do $$ declare changed integer; begin
 if exists(select 1 from public.wisdom_favorites where article_id='rls-test') then raise exception 'Cross-user read was allowed'; end if;
 delete from public.wisdom_favorites where article_id='rls-test';
 get diagnostics changed = row_count;
 if changed <> 0 then raise exception 'Cross-user delete was allowed'; end if;
end $$;
select set_config('request.jwt.claim.sub','3e612d83-f0b4-4321-988e-5531e0d4b401',true);
do $$ declare changed integer; begin
 begin
  update public.wisdom_favorites set article_title='Unexpected change' where article_id='rls-test';
  raise exception 'Unnecessary update privilege was allowed';
 exception when insufficient_privilege then null; end;
 delete from public.wisdom_favorites where article_id='rls-test';
 get diagnostics changed = row_count;
 if changed <> 1 then raise exception 'Owner cannot delete own favorite'; end if;
end $$;
set local role anon;
do $$ begin
 begin
  perform * from public.wisdom_favorites;
  raise exception 'Anonymous read was allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.wisdom_favorites(user_id,article_id,article_title,quote_text,page,end_page)
   values ('3e612d83-f0b4-4321-988e-5531e0d4b402','rls-test','权限测试','匿名访问不能写入这条测试金句。',1,1);
  raise exception 'Anonymous insert was allowed';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: owner access, cross-user isolation and anonymous denial' as result;
