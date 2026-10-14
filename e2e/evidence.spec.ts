import {test,expect} from '@playwright/test';
test('search locks, clue details and evidence board',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Explore the case'}).click();await page.getByRole('button',{name:'Begin investigation'}).click();await page.getByRole('button',{name:'Enter the museum'}).click();
 await page.getByRole('button',{name:/Where the silence began/}).click();await expect(page.getByRole('button',{name:'Search Sensor housing'})).toBeDisabled();
 await page.getByRole('button',{name:'Search Display pedestal'}).click();await expect(page.getByRole('dialog',{name:'Maintenance slip'})).toBeVisible();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Search Sensor housing'}).click();await page.getByRole('button',{name:'View evidence board'}).click();
 await page.getByRole('button',{name:'Pin Maintenance slip'}).click();await page.getByRole('button',{name:'Pin Silent sensor'}).click();await page.getByRole('button',{name:'Compare evidence'}).click();await expect(page.getByRole('dialog',{name:'Compare your thread'})).toBeVisible();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Clear',exact:true}).click();await expect(page.getByRole('button',{name:'Pin Maintenance slip'})).toHaveAttribute('aria-pressed','false');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
