import {test,expect} from '@playwright/test';
test('evidence-dependent interview opens a locked record',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Explore the case'}).click();await page.getByRole('button',{name:'Begin investigation'}).click();await page.getByRole('button',{name:'Enter the museum'}).click();
 const nav=page.getByRole('navigation',{name:'Investigation navigation'});await nav.getByRole('button',{name:'Interviews',exact:true}).click();await page.getByRole('button',{name:/Theo Shaw/}).click();await expect(page.getByRole('button',{name:'Who held credential C3 tonight?'})).toBeDisabled();
 await nav.getByRole('button',{name:'Locations',exact:true}).click();await page.getByRole('button',{name:/Every second leaves a trace/}).click();await page.getByRole('button',{name:'Search Access terminal'}).click();await page.keyboard.press('Escape');
 await nav.getByRole('button',{name:'Interviews',exact:true}).click();await page.getByRole('button',{name:/Theo Shaw/}).click();await page.getByRole('button',{name:'Who held credential C3 tonight?'}).click();await page.getByRole('button',{name:'Visit Security Office'}).click();await page.getByRole('button',{name:'Search Custody envelope'}).click();await expect(page.getByRole('dialog',{name:'Card custody receipt'})).toBeVisible();
});
