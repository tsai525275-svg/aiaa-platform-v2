AIAA PATCH V54

目的：
修正 /apply 和 /apply/agent 已登入後仍顯示 Create Account, Sign In, Create account to submit 的問題。

修正內容：
1. /apply 只做流程入口，不再寫死建立帳戶 CTA。
2. /apply/agent 改成真正的 CertificationApplicationForm。
3. 未登入者由 AuthGate 顯示登入入口。
4. 已登入者直接看到提交申請表。
5. 提交後寫入 Supabase aiaa_certification_applications。

注意：
localhost 和正式站是兩個不同網域，登入狀態不會共用。
在 localhost 登入，只會登入 localhost。
在 aiaaonline.org 登入，只會登入正式站。
