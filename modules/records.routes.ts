import express from 'express';

const recordRoutes = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Records:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         records:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               favoriteMovie:
 *                 type: string
 *               date:
 *                 type: string
 */

//interface of the object, adding an optional property
interface userObj {
    Name: string;
    FavoriteFood: string;
    FavoriteMovie: string;
    Status: string;
    date?: string;
}

// Create array of objetcs
const recordsArr: userObj[] = [{
    'Name': 'Rocky',
    'FavoriteFood': 'Sushi',
    'FavoriteMovie': 'Back to The Future',
    'Status': 'Inactive'
}, {
    'Name': 'Miroslav',
    'FavoriteFood': 'Sushi',
    'FavoriteMovie': 'American Psycho',
    'Status': 'Active'
}, {
    'Name': 'Donny',
    'FavoriteFood': 'Singapore chow mei fun',
    'FavoriteMovie': 'The Princess Bride',
    'Status': 'Inactive'
}, {
    'Name': 'Matt',
    'FavoriteFood': 'Brisket Tacos',
    'FavoriteMovie': 'The Princess Bride',
    'Status': 'Active'
}, {
    'Name': 'Juan Pablo',
    'FavoriteFood': 'Tacos',
    'FavoriteMovie': 'Star Wars',
    'Status': 'Active'
}];

// Function to sort the output of the script by property
function getActiveRecordsSorted(property: keyof userObj) {
    // Add date field to the objects in the array with the day the script ran
    for (const user of recordsArr) {
        user.date = new Date().toLocaleDateString();
    }

    // Filter the array to get the active records
    const activeRecords = recordsArr.filter(record => record.Status === 'Active');

    // Sort the array by property name
    const result = activeRecords.sort((a, b) => {
        const aValue = a[property];
        const bValue = b[property];

        if (aValue === undefined || bValue === undefined) {
            return 0; // Handle the case where either property is undefined
        }

        return aValue > bValue ? 1 : -1;
    });

    // If array length is 0 dont run, message of no records was previously displayed
    if (result.length !== 0) {
        // Log the sorted output previously obtained
        const records = result.map(records => {
            return ({ name: records.Name, date: records.date, favoriteMovie: records.FavoriteMovie })
        })

        return records;
    }
}

/**
* @swagger
* /api/records:
*   get:
*     summary: get records
*     tags: [Records]
*     responses:
*       200:
*         description: The created book.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Records'
*       500:
*         description: Some server error
*
*/
recordRoutes.get('/', (req, res) => {
    // Add date field to the objects in the array with the day the script ran
    for (const user of recordsArr) {
        user.date = new Date().toLocaleDateString();
    }

    // Filter the array to get the active records
    const activeRecords = recordsArr.filter(record => record.Status === 'Active');

    // Logging active records by name, date, favorite movie if there are active records, if not send a message that there are not active records
    if (activeRecords.length !== 0) {
        const records = activeRecords.map(records => {
            return ({ name: records.Name, date: records.date, favoriteMovie: records.FavoriteMovie })
        })

        res.status(200).send({ message: 'Records obtained', records });
    } else {
        res.status(200).send({ message: 'No active records found', records: [] });
    }
});

/**
* @swagger
* /api/records/sorted:
*   get:
*     summary: Get sorted array by property
*     tags: [Records]
*     description: Returns a user by their ID.
*     parameters:
*       - in: query
*         name: sort
*         required: true
*         description: sort by.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successful response.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Records'
*/
recordRoutes.get('/sorted', (req, res) => {
    const records = getActiveRecordsSorted(req.query.sort as keyof userObj);

    res.status(200).send({ message: 'Sorted records obtained', records });
});

recordRoutes.post('/', (req, res) => {
    console.log(req.body);

    res.status(200).send({ message: 'Record created', records: [] });
});

export { recordRoutes }