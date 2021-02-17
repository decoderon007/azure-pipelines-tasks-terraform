
import { CommonServiceIds } from "azure-devops-extension-api";
import { BuildServiceIds } from "azure-devops-extension-api/Build";

/**
 * Mocked Init Function to return resolve
 */
export function init() : Promise<void> {
    return new Promise((resolve, reject) => resolve());
}

export function getService(contributionId: string) {

    switch(contributionId) {
        case CommonServiceIds.ProjectPageService:
            return new Promise((resolve) => resolve({
                }
            ));
        case BuildServiceIds.BuildPageDataService:
            return new Promise((resolve) => resolve({
                }
            ));
    }
}