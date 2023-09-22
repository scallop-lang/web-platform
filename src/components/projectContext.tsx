import { useState, createContext } from 'react';
import type { RelationRecord, SclProgram } from "~/utils/schemas-types";

interface ProjectContextType {
    program: SclProgram;
    setProgram: React.Dispatch<React.SetStateAction<SclProgram>>;
    inputs: RelationRecord;
    setInputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
    outputs: RelationRecord;
    setOutputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}

interface TableContextType {
    activeRelationName: string;
    setActiveRelationName: React.Dispatch<React.SetStateAction<string>>;
}

export const ProjectContext = createContext<ProjectContextType>({
    program: "",
    setProgram: () => undefined,
    inputs: {},
    setInputs: () => undefined,
    outputs: {},
    setOutputs: () => undefined
});

export const TableContext = createContext<TableContextType>({
    activeRelationName: "",
    setActiveRelationName: () => undefined
});

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
    const [program, setProgram] = useState<SclProgram>("");
    const [inputs, setInputs] = useState<RelationRecord>({});
    const [outputs, setOutputs] = useState<RelationRecord>({});

    const providerValue = {
        program,
        setProgram,
        inputs,
        setInputs,
        outputs,
        setOutputs
    }

    return (
        <ProjectContext.Provider value={providerValue}>
            {children}
        </ProjectContext.Provider>
    )
}

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeRelationName, setActiveRelationName] = useState<string>("");

    const providerValue = {
        activeRelationName,
        setActiveRelationName
    }

    return (
        <TableContext.Provider value={providerValue}>
            {children}
        </TableContext.Provider>
    )
}