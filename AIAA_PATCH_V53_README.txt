AIAA PATCH V53

完整重整提交申請和考證書流程。

包含：
1. /apply 不再引導已登入會員建立帳戶。
2. /apply/agent 只保留真實申請表。
3. 已登入會員看到提交申請。
4. 未登入訪客看到登入後申請。
5. 新會員不會自動得到 Level 1。
6. 申請寫入 Supabase aiaa_certification_applications。
7. /member/applications 讀取真實申請紀錄。
8. /member/exam 讀取真實申請，考試送出後進入審核。
9. 審核通過和證書核發不自動發生。
10. 會員首頁會接真實申請狀態。

先跑 supabase/aiaa-certification-applications-v2.sql。
再測本機。
最後推上正式站。
