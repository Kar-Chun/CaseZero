import {test,expect} from '@playwright/test';
import {navigate,visit,search} from './helpers';
async function begin(page:import('@playwright/test').Page){await page.goto('/');await page.getByRole('button',{name:'Explore the case'}).click();await page.getByRole('button',{name:'Begin investigation'}).click();await page.getByRole('button',{name:'Enter the museum'}).click();}
test('refresh restores evidence and notes; reset and new game clear progress',async({page})=>{
 await begin(page);await visit(page,'The Grand Gallery');await search(page,'Display pedestal','Maintenance slip');await navigate(page,'Notebook');await page.getByRole('textbox',{name:'Case notes'}).fill('No broken glass. Check maintenance.');
 await page.reload();await page.getByRole('button',{name:'Continue investigation'}).click();await navigate(page,'Notebook');await expect(page.getByRole('textbox',{name:'Case notes'})).toHaveValue('No broken glass. Check maintenance.');await expect(page.getByRole('button',{name:/E01 Maintenance slip/})).toBeVisible();
 await page.getByRole('button',{name:'CaseZero home'}).click();await page.getByRole('button',{name:'New game',exact:true}).click();await page.getByRole('button',{name:'Start new game'}).click();await page.getByRole('button',{name:'Enter the museum'}).click();await navigate(page,'Notebook');await expect(page.getByRole('textbox',{name:'Case notes'})).toHaveValue('');
 await page.getByRole('button',{name:'Reset progress'}).click();await page.getByRole('button',{name:'Reset case'}).click();await expect(page.getByRole('button',{name:'Explore the case'})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('casezero:progress:v1'))).toBeNull();
});
test('outdated save explains recovery and storage denial still allows play',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('casezero:progress:v1',JSON.stringify({version:0})));await page.goto('/');await expect(page.getByRole('status')).toContainText('unsupported version');await expect(page.getByRole('button',{name:'Explore the case'})).toBeVisible();
 const other=await page.context().newPage();await other.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}}));await begin(other);await visit(other,'The Grand Gallery');await search(other,'Display pedestal','Maintenance slip');await expect(other.getByText('Saving unavailable · session only')).toBeVisible();await other.close();
});
test('two tabs synchronize discoveries and a reset',async({page,context})=>{
 await begin(page);const other=await context.newPage();await other.goto('/');await other.getByRole('button',{name:'Continue investigation'}).click();
 await visit(page,'The Grand Gallery');await search(page,'Display pedestal','Maintenance slip');await navigate(other,'Evidence board');await expect(other.getByRole('button',{name:'Read Maintenance slip'})).toBeVisible();
 await navigate(page,'Notebook');await page.getByRole('button',{name:'Reset progress'}).click();await page.getByRole('button',{name:'Reset case'}).click();await expect(other.getByRole('button',{name:'Explore the case'})).toBeVisible();await other.close();
});
