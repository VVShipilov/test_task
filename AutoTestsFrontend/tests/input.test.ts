import { chromium, test } from "@playwright/test"
import { expect } from '@playwright/test'

test("Test input", async ({}) => {

    const browser = await chromium.launch({headless: false});

     await test.step('Тест 1. Ввод корректного номера и двузначного региона', async() => {

        const context1 = await browser.newContext();
        const page1 = await context1.newPage();

        //открыть страницу
        await page1.goto("https://b2c.pampadu.ru/index.html#49a973bd-2d7c-4b9b-9c28-d986d7757983")

        //заполнить номер
        await page1.fill('input[class ="gos-input-main"]', "Р252ВВ")

        //заполнить регион
        await page1.fill('input[class ="gos-input-region"]', "56")

        //нажать кнопку "Продолжить"
        await page1.click('button:has-text("Продолжить")')

        //как вариант, для проверки того, что мы перешли на следующий шаг - у нас должна появиться кнопка с текстом "Назад"
        await expect(page1.locator('button:has-text("Назад")')).toBeVisible();
        await page1.click('button:has-text("Назад")')
    })

    await test.step('Тест 2. Ввод корректного номера и трехзначного региона', async() => {

        const context2 = await browser.newContext();
        const page2 = await context2.newPage();
        //открыть страницу
        await page2.goto("https://b2c.pampadu.ru/index.html#49a973bd-2d7c-4b9b-9c28-d986d7757983")

        //заполнить номер
        await page2.fill('input[class ="gos-input-main"]', "О001ОО")

        //заполнить регион
        await page2.fill('input[class ="gos-input-region"]', "199")

        //нажать кнопку "Продолжить"
        await page2.click('button:has-text("Продолжить")')

        //как вариант, для проверки того, что мы перешли на следующий шаг - у нас должна появиться кнопка с текстом "Назад"
        await expect(page2.locator('button:has-text("Назад")')).toBeVisible();
        await page2.click('button:has-text("Назад")')
    })
    
    await test.step('Тест 3. Ввод некорректного номера. 1 недопустимая буква', async() => {

        const context3 = await browser.newContext();
        const page3 = await context3.newPage();
        //открыть страницу
        await page3.goto("https://b2c.pampadu.ru/index.html#49a973bd-2d7c-4b9b-9c28-d986d7757983")

        //заполнить номер
        await page3.fill('input[class ="gos-input-main"]', "О001ОП")

        //заполнить регион
        await page3.fill('input[class ="gos-input-region"]', "199")

        //нажать кнопку "Продолжить"
        await page3.click('button:has-text("Продолжить")')

        //не вышло привязаться к проверке того, что находится в input-е, поэтому добавляю "костыльное" ожидание, что кнопка "Назад" НЕ появляется
        await expect(page3.locator('button:has-text("Назад")')).not.toBeVisible();
    }) 

    await test.step('Тест 4. Ввод несуществующего региона', async() => {

        const context4 = await browser.newContext();
        const page4 = await context4.newPage();
        //открыть страницу
        await page4.goto("https://b2c.pampadu.ru/index.html#49a973bd-2d7c-4b9b-9c28-d986d7757983")

        //заполнить номер
        await page4.fill('input[class ="gos-input-main"]', "Р256РР")

        //заполнить регион
        await page4.fill('input[class ="gos-input-region"]', "256")

        //нажать кнопку "Продолжить"
        await page4.click('button:has-text("Продолжить")')

        //пользователю отображаются поля для уточнения марки и модели автомобиля
        await expect(page4.locator('input[data-test="left-side-car-mark"]')).toBeVisible();
        await expect(page4.locator('input[data-test="left-side-car-model"]')).toBeVisible();
    })

    await test.step('Тест 5. Посимвольный ввод недопустимых(не предусмотренные в номере или латиница) символов в поля.', async() => {

        /* (Пример: посимвольный ввод следующей строки "1ЪХ В252 9ВGJ" в поле для номера,
        в итоге должен привести к следующей введеной строке "Х252ВО")
        Т.к. при смене раскладки "G" соответствует "П", то этот символ должен игнорироваться,
        а т.к. символу "J" соответствует "О", то этот символ должен быть введен*/

        const context5 = await browser.newContext();
        const page5 = await context5.newPage();
        //открыть страницу
        await page5.goto("https://b2c.pampadu.ru/index.html#49a973bd-2d7c-4b9b-9c28-d986d7757983")

        //заполнить номер
        await page5.locator('input[class ="gos-input-main"]').type('1ЪХ В252 9ВGJ', {delay: 100})
        
        //заполнить регион
        await page5.locator('input[class ="gos-input-region"]').type('R99Ы9', {delay: 100})

        //await page5.waitForTimeout(4000)

        //нажать кнопку "Продолжить"
        await page5.click('button:has-text("Продолжить")')

        //не вышло привязаться к проверке того, что находится в input-е, поэтому добавляю "костыльное" ожидание, что появляется кнопка "Назад" 
        await expect(page5.locator('button:has-text("Назад")')).toBeVisible();
    })

    //закрыть браузер
    await browser.close();
})