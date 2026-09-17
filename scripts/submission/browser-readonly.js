async page => {
 const baseUrl = await page.evaluate(() => window.location.origin);
 if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(baseUrl)) throw new Error("Open the local ProofData app first");
 const checks=[]; const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 const check=(name,condition,detail)=>{checks.push({name,status:condition?'PASS':'FAIL',detail});if(!condition)throw new Error(name+': '+detail);};
 await page.goto(`${baseUrl}/`);
 check('explore without wallet',(await page.title()).includes('ProofData'),'Public homepage loads');
 check('decorative evidence is labeled',await page.getByText('ABSTRACT EVIDENCE SPECIMEN',{exact:true}).isVisible(),'Crystal is labeled as an abstract representation, not literal evidence');
 check('no forced connection',await page.getByRole('link',{name:'Create Warrant',exact:true}).isVisible(),'Create navigation is available disconnected');
 await page.getByRole('link',{name:'Create Warrant',exact:true}).click();
 await page.getByLabel('Resource URI').waitFor();
 check('qualified example',await page.getByLabel('Resource URI').inputValue()==='https://unpkg.com/genlayer-js@1.1.8/dist/index-BCPb0x30.d.ts','Exact V2 URL');
 check('qualified hash',await page.getByLabel('Expected Keccak256 Hash').inputValue()==='b4c91843ee2e1a3043bb3b49a431c513356331023042861a525308e449210525','Exact V2 Keccak');
 const walletAvailable=await page.evaluate(()=>typeof window.ethereum!=='undefined');
 if(!walletAvailable){await page.getByRole('button',{name:'CONNECT WALLET',exact:true}).click();check('disconnected error',await page.getByText('No compatible browser wallet detected.',{exact:true}).isVisible(),'Readable wallet missing state');}
 await page.goto(`${baseUrl}/warrant/storage-fix-low-diag-001`);
 await page.locator('[data-status="WARRANTED"]').waitFor({timeout:45000});
 check('LOW authoritative display',await page.locator('[data-status="WARRANTED"]').isVisible(),'Contract-backed LOW verdict');
 await page.reload();check('LOW fresh readback',await page.locator('[data-status="WARRANTED"]').isVisible(),'Verdict survives full reload');
 await page.goto(`${baseUrl}/warrant/thesis2-high-001`);
 check('HIGH authoritative display',await page.locator('[data-status="NOT_WARRANTED"]').isVisible(),'Contract-backed HIGH verdict');
 await page.reload();check('HIGH fresh readback',await page.locator('[data-status="NOT_WARRANTED"]').isVisible(),'Verdict survives full reload');
 await page.goto(`${baseUrl}/compare`);
 check('real compare reads',await page.locator('[data-status="WARRANTED"]').isVisible()&&await page.locator('[data-status="NOT_WARRANTED"]').isVisible(),'Final proof pair is the default');
 await page.reload();check('compare default persists after reload',await page.locator('[data-status="WARRANTED"]').isVisible()&&await page.locator('[data-status="NOT_WARRANTED"]').isVisible(),'Fresh compare readback');
 check('same evidence display',await page.getByText('SAME EVIDENCE VERIFIED',{exact:true}).isVisible(),'Stored URL/hash equality');
 await page.goto(`${baseUrl}/warrant/warrant-4905a143-4d22-4603-9763-c15e87166a47`);
 await page.locator('[data-status="WARRANTED"]').waitFor({timeout:45000});
 check('fresh E2E authoritative display',await page.locator('[data-status="WARRANTED"]').isVisible(),'New warrant read from fixed contract');
 check('fresh E2E purpose matches',await page.getByText('Use this evidence to prepare an internal developer note listing the declared GenLayerJS testnet network exports.',{exact:true}).isVisible(),'Stored fresh purpose');
 await page.reload();
 check('fresh E2E cold readback',await page.locator('[data-status="WARRANTED"]').isVisible(),'New verdict survives full reload without a signer');
 check('no browser runtime errors',errors.length===0,errors.join('; '));
 return {classification:'PASS',checks,walletAvailable,scope:'Direction A redesign read-only production regression; live MetaMask lifecycle is preserved separately',baseUrl,observedAt:new Date().toISOString(),errors};
}
