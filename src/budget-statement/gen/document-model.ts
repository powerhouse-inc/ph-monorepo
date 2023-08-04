import type { DocumentModelState } from "../../document-model";

export const documentModel: DocumentModelState = {
    "id": "powerhouse/budget-statement",
    "name": "BudgetStatement",
    "extension": "phbs",
    "description": "The BudgetStatement module manages the state and actions related to budget statements, which are documents that track the financial transactions of an organization over a month.",
    "author": {
        "name": "Powerhouse",
        "website": "https://powerhouse.inc/"
    },
    "specifications": [
        {
            "version": 1,
            "changeLog": [],
            "modules": [
                {
                    "name": "account",
                    "operations": [
                        {
                            "name": "AddAccount",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "UpdateAccount",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "DeleteAccount",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "SortAccounts",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        }
                    ],
                    "id": "",
                    "description": ""
                },
                {
                    "name": "line-item",
                    "operations": [
                        {
                            "name": "AddLineItem",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "UpdateLineItem",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "DeleteLineItem",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "SortLineItems",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        }
                    ],
                    "id": "",
                    "description": ""
                },
                {
                    "name": "base",
                    "operations": [
                        {
                            "name": "SetOwner",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "SetMonth",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "SetFtes",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "SetQuoteCurrency",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        }
                    ],
                    "id": "",
                    "description": ""
                },
                {
                    "name": "audit",
                    "operations": [
                        {
                            "name": "AddAuditReport",
                            "id": "",
                            "description": "",
                            "schema": "\n                                input AddAuditReportInput {\n                                    timestamp: DateTime\n                                    report: Attachment!\n                                    status: AuditReportStatus!\n                                }",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "DeleteAuditReport",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        }
                    ],
                    "id": "",
                    "description": ""
                },
                {
                    "name": "comment",
                    "operations": [
                        {
                            "name": "AddComment",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "UpdateComment",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "DeleteComment",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        }
                    ],
                    "id": "",
                    "description": ""
                },
                {
                    "name": "vesting",
                    "operations": [
                        {
                            "name": "AddVesting",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "UpdateVesting",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        },
                        {
                            "name": "DeleteVesting",
                            "id": "",
                            "description": "",
                            "schema": "",
                            "template": "",
                            "reducer": "",
                            "examples": [],
                            "errors": []
                        }
                    ],
                    "id": "",
                    "description": ""
                }
            ],
            "state": {
                "schema": "",
                "initialValue": "{\n    \"owner\": {\n        \"ref\": null,\n        \"id\": null,\n        \"title\": null\n    },\n    \"month\": null,\n    \"quoteCurrency\": null,\n    \"vesting\": [],\n    \"ftes\": null,\n    \"accounts\": [],\n    \"auditReports\": [],\n    \"comments\": []\n}",
                "examples": []
            }
        }
    ]
};