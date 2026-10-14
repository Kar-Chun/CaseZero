import {test,expect} from '@playwright/test';
test('case navigation, responsive museum and keyboard guide',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.getByRole('heading',{name:/truth hides/})).toBeVisible();
 await page.getByRole('button',{name:'How to play'}).click();await expect(page.getByRole('dialog',{name:'Your field guide'})).toBeFocused();
 await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'How to play'})).toBeFocused();
 await page.getByRole('button',{name:'Explore the case'}).click();await page.getByRole('button',{name:'Begin investigation'}).click();
 await page.getByRole('button',{name:'Enter the museum'}).click();await expect(page.getByRole('button',{name:/Where the silence began/})).toBeVisible();
 await page.getByRole('button',{name:/Where the silence began/}).click();await expect(page.getByRole('heading',{name:'The Grand Gallery'})).toBeVisible();
 await page.getByRole('button',{name:'Museum map'}).click();
 for(const name of ['Evidence board','Interviews','Notebook','Accusation','Locations']){await page.getByRole('navigation',{name:'Investigation navigation'}).getByRole('button',{name,exact:true}).click();}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
